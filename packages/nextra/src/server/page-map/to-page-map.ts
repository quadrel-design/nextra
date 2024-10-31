import path from 'node:path'
import type { TItem } from '../../types.js'

interface NestedMap {
  [key: string]: NestedMap
}

type StringMap = Record<string, string>

const createNested = (prevValue: NestedMap, currVal: string) =>
  (prevValue[currVal] ||= {})

export function convertToPageMap({
  filePaths,
  basePath,
  locale
}: {
  filePaths: string[]
  basePath?: string
  locale?: string
}) {
  let mdxPages: StringMap = {}
  const metaFiles: StringMap = {}
  for (const filePath of filePaths) {
    let { name, dir } = path.parse(filePath)
    const inAppDir = filePath.startsWith('app/')
    if (inAppDir) {
      dir = dir.replace(/^app(\/|$)/, '')
    } else {
      let filePath = dir.replace(/^content(\/|$)/, '')
      if (locale) filePath = filePath.replace(new RegExp(`^${locale}/?`), '')
      dir = [basePath, filePath].filter(Boolean).join('/')
    }
    if (name === '_meta') {
      const key = dir ? `${dir}/${name}` : name
      metaFiles[key] = filePath
    } else {
      const key = inAppDir
        ? // In Next.js we can organize routes without affecting the URL
          // https://nextjs.org/docs/app/building-your-application/routing/route-groups#organize-routes-without-affecting-the-url-path
          //
          // E.g. we have the following filepath:
          // app/posts/(with-comments)/aaron-swartz-a-programmable-web/()/page.mdx
          //
          // will be normalized to:
          // app/posts/aaron-swartz-a-programmable-web/page.mdx
          dir.replaceAll(/\(.*?\)\//g, '')
        : [dir, name !== 'index' && name].filter(Boolean).join('/')
      mdxPages[key] = filePath
    }
  }

  const obj: NestedMap = {}

  for (const path of Object.keys(metaFiles)) {
    path.split('/').reduce(createNested, obj)
  }
  for (const path of Object.keys(mdxPages)) {
    const key = path && `${path}/`
    key.split('/').reduce(createNested, obj)
  }

  function fillPageMap(obj: NestedMap, prefix?: string): TItem[] {
    const children: TItem[] = []

    for (const [key, value] of Object.entries(obj)) {
      const path = prefix && key ? `${prefix}/${key}` : prefix || key
      if (key === '_meta') {
        const __metaPath = metaFiles[path]
        if (!__metaPath) {
          const o = JSON.stringify({ path, metaFiles }, null, 2)
          throw new Error(`Can't find "_meta" file for:\n${o}`)
        }
        children.push({ __metaPath })
        continue
      }
      const item = {
        name: key || 'index',
        route: `/${path}`
      }
      const keys = Object.keys(value)
      const isFolder = keys.length > 1 || (keys.length === 1 && keys[0] !== '')

      if (isFolder) {
        children.push({ ...item, children: fillPageMap(value, path) })
        continue
      }
      const __pagePath = mdxPages[path]
      if (!__pagePath) {
        const o = JSON.stringify({ path, mdxPages }, null, 2)
        throw new Error(`Can't find "page" file for:\n${o}`)
      }
      children.push({ ...item, __pagePath })
    }
    return children
  }

  const pageMap = fillPageMap(obj)

  mdxPages = Object.fromEntries(
    Object.entries(mdxPages).flatMap(([key, value]) => {
      if (basePath) key = key.replace(new RegExp(`^${basePath}/?`), '')
      value = value.replace(/^content\//, '')
      if (locale) value = value.replace(new RegExp(`^${locale}/`), '')

      // Do not add pages from `app/` dir to `mdxPages`
      if (value.startsWith('app/')) {
        return []
      }

      return [[key, value]]
    })
  )
  return { pageMap, mdxPages }
}
