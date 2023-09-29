import path from 'node:path'
import slash from 'slash'
import type { LoaderContext } from 'webpack'
import type { LoaderOptions, PageOpts } from '../types'
import { compileMdx } from './compile.js'
import {
  CHUNKS_DIR,
  CWD,
  MARKDOWN_EXTENSION_REGEX,
  OFFICIAL_THEMES
} from './constants.js'
import { PAGES_DIR } from './file-system.js'
import { logger, pageTitleFromFilename } from './utils.js'

const initGitRepo = (async () => {
  const IS_WEB_CONTAINER = !!process.versions.webcontainer

  if (!IS_WEB_CONTAINER) {
    const { Repository } = await import('@napi-rs/simple-git')
    try {
      const repository = Repository.discover(CWD)
      if (repository.isShallow()) {
        if (process.env.VERCEL) {
          logger.warn(
            'The repository is shallow cloned, so the latest modified time will not be presented. Set the VERCEL_DEEP_CLONE=true environment variable to enable deep cloning.'
          )
        } else if (process.env.GITHUB_ACTION) {
          logger.warn(
            'The repository is shallow cloned, so the latest modified time will not be presented. See https://github.com/actions/checkout#fetch-all-history-for-all-tags-and-branches to fetch all the history.'
          )
        } else {
          logger.warn(
            'The repository is shallow cloned, so the latest modified time will not be presented.'
          )
        }
      }
      // repository.path() returns the `/path/to/repo/.git`, we need the parent directory of it
      const gitRoot = path.join(repository.path(), '..')
      return { repository, gitRoot }
    } catch (error) {
      logger.warn(`Init git repository failed ${(error as Error).message}`)
    }
  }
  return {}
})()

let isAppFileFromNodeModules = false

export async function loader(
  this: LoaderContext<LoaderOptions>,
  source: string
): Promise<string> {
  const {
    isPageImport = false,
    isPageMapImport,
    isMetaFile,
    theme,
    themeConfig,
    defaultShowCopyCode,
    search,
    staticImage,
    readingTime: _readingTime,
    latex,
    codeHighlight,
    transform,
    transformPageOpts,
    mdxOptions,
    locales
  } = this.getOptions()

  const mdxPath = this._module?.resourceResolveData
    ? // to make it work with symlinks, resolve the mdx path based on the relative path
      /*
       * `context.rootContext` could include path chunk of
       * `context._module.resourceResolveData.relativePath` use
       * `context._module.resourceResolveData.descriptionFileRoot` instead
       */
      path.join(
        this._module.resourceResolveData.descriptionFileRoot,
        this._module.resourceResolveData.relativePath
      )
    : this.resourcePath

  if (mdxPath.includes('/pages/api/')) {
    logger.warn(
      `Ignoring ${mdxPath} because it is located in the "pages/api" folder.`
    )
    return ''
  }
  if (isMetaFile) {
    // _meta.[jt]sx? used as a page.
    return 'export default () => null'
  }

  if (mdxPath.includes('/pages/_app.mdx')) {
    throw new Error(
      'Nextra v3 no longer supports _app.mdx, use _app.{js,jsx} or _app.{ts,tsx} for TypeScript projects instead.'
    )
  }

  const isLocalTheme = theme.startsWith('.') || theme.startsWith('/')
  const layoutPath = isLocalTheme ? slash(path.resolve(theme)) : theme

  const cssImports = `
${latex ? "import 'katex/dist/katex.min.css'" : ''}
${OFFICIAL_THEMES.includes(theme) ? `import '${theme}/style.css'` : ''}`

  if (mdxPath.includes('/pages/_app.')) {
    isAppFileFromNodeModules = mdxPath.includes('/node_modules/')
    // Relative path instead of a package name
    const themeConfigImport = themeConfig
      ? `import __themeConfig from '${slash(path.resolve(themeConfig))}'`
      : ''

    const content = isAppFileFromNodeModules
      ? 'export default function App({ Component, pageProps }) { return <Component {...pageProps} />}'
      : [cssImports, source].join('\n')

    return `import __layout from '${layoutPath}'
${themeConfigImport}
${content}

const __nextra_internal__ = globalThis[Symbol.for('__nextra_internal__')] ||= Object.create(null)
__nextra_internal__.context ||= Object.create(null)
__nextra_internal__.Layout = __layout
${themeConfigImport && '__nextra_internal__.themeConfig = __themeConfig'}`
  }

  const locale =
    locales[0] === '' ? '' : mdxPath.replace(PAGES_DIR, '').split('/')[1]

  const route =
    '/' +
    path
      .relative(PAGES_DIR, mdxPath)
      .replace(MARKDOWN_EXTENSION_REGEX, '')
      .replace(/(^|\/)index$/, '')

  const {
    result,
    title,
    frontMatter,
    structurizedData,
    searchIndexKey,
    hasJsxInH1,
    readingTime
  } = await compileMdx(source, {
    mdxOptions: {
      ...mdxOptions,
      jsx: true,
      outputFormat: 'program',
      format: 'detect'
    },
    readingTime: _readingTime,
    defaultShowCopyCode,
    staticImage,
    search,
    latex,
    codeHighlight,
    route,
    locale,
    filePath: mdxPath,
    useCachedCompiler: true,
    isPageImport,
    isPageMapImport
  })
  // Imported as a normal component, no need to add the layout.
  if (!isPageImport) {
    return `${result}
export default _createMdxContent`
  }
  // Logic for resolving the page title (used for search and as fallback):
  // 1. If the frontMatter has a title, use it.
  // 2. Use the first h1 heading if it exists.
  // 3. Use the fallback, title-cased file name.
  const fallbackTitle =
    frontMatter.title ||
    title ||
    pageTitleFromFilename(path.parse(mdxPath).name)

  if (searchIndexKey && frontMatter.searchable !== false) {
    // Store all the things in buildInfo.
    const { buildInfo } = this._module as any
    buildInfo.nextraSearch = {
      indexKey: searchIndexKey,
      title: fallbackTitle,
      data: structurizedData,
      route
    }
  }

  let timestamp: PageOpts['timestamp']
  const { repository, gitRoot } = await initGitRepo
  if (repository && gitRoot) {
    try {
      timestamp = await repository.getFileLatestModifiedDateAsync(
        path.relative(gitRoot, mdxPath)
      )
    } catch {
      // Failed to get timestamp for this file. Silently ignore it
    }
  }

  let pageOpts: Partial<PageOpts> = {
    filePath: slash(path.relative(CWD, mdxPath)),
    hasJsxInH1,
    timestamp,
    readingTime,
    title: fallbackTitle
  }
  if (transformPageOpts) {
    // It is possible that a theme wants to attach customized data, or modify
    // some fields of `pageOpts`. One example is that the theme doesn't need
    // to access the full pageMap or frontMatter of other pages, and it's not
    // necessary to include them in the bundle
    pageOpts = transformPageOpts(pageOpts as any)
  }
  const finalResult = transform ? await transform(result, { route }) : result

  const stringifiedPageOpts = JSON.stringify(pageOpts).slice(0, -1)
  const pageMapPath = path.join(CHUNKS_DIR, `nextra-page-map-${locale}.mjs`)

  const rawJs = `import { setupNextraPage } from 'nextra/setup-page'
import { pageMap } from '${pageMapPath}'
${isAppFileFromNodeModules ? cssImports : ''}
${finalResult}

export default setupNextraPage(
  MDXContent,
  '${route}',
  ${stringifiedPageOpts},pageMap,frontMatter}
)`

  return rawJs
}
