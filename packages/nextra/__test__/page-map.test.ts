import path from 'node:path'
import { CWD } from '../src/constants'
import { collectPageMap } from '../src/server/page-map'

describe('collectPageMap', () => {
  it('should work', async () => {
    const dir = path.join(
      CWD,
      '..',
      '..',
      'examples',
      'swr-site',
      'pages',
      'en'
    )
    const rawJs = await collectPageMap({ dir, route: '/en' })
    expect(rawJs).toMatchInlineSnapshot(`
      "import meta0 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/_meta.json\\";
      import meta1 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/about/_meta.ts\\";
      import meta2 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/blog/_meta.ts\\";
      import meta3 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/_meta.ts\\";
      import meta4 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/examples/_meta.ts\\";
      import meta5 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/docs/advanced/_meta.ts\\";
      import meta6 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/remote/graphql-eslint/_meta.ts\\";
      import meta7 from \\"/Users/dmytro/Desktop/nextra/examples/swr-site/pages/en/remote/graphql-yoga/_meta.ts\\";
      export const pageMap = [{
        data: meta0
      }, {
        name: \\"about\\",
        route: \\"/en/about\\",
        children: [{
          data: meta1
        }, {
          name: \\"a-page\\",
          route: \\"/en/about/a-page\\"
        }, {
          name: \\"acknowledgement\\",
          route: \\"/en/about/acknowledgement\\"
        }, {
          name: \\"changelog\\",
          route: \\"/en/about/changelog\\"
        }, {
          name: \\"team\\",
          route: \\"/en/about/team\\"
        }]
      }, {
        name: \\"blog\\",
        route: \\"/en/blog\\",
        children: [{
          data: meta2
        }, {
          name: \\"swr-v1\\",
          route: \\"/en/blog/swr-v1\\",
          frontMatter: {
            \\"image\\": \\"https://assets.vercel.com/image/upload/v1630059453/swr/v1.png\\",
            \\"description\\": \\"Almost 2 years ago we open sourced SWR, the tiny data-fetching React library that people love. Today we are reaching another milestone: the 1.0 version of SWR.\\"
          }
        }]
      }, {
        name: \\"blog\\",
        route: \\"/en/blog\\",
        frontMatter: {
          \\"searchable\\": false
        }
      }, {
        name: \\"docs\\",
        route: \\"/en/docs\\",
        children: [{
          name: \\"404-500\\",
          route: \\"/en/docs/404-500\\"
        }, {
          data: meta3
        }, {
          name: \\"advanced\\",
          route: \\"/en/docs/advanced\\",
          children: [{
            data: meta5
          }, {
            name: \\"cache\\",
            route: \\"/en/docs/advanced/cache\\"
          }, {
            name: \\"code-highlighting\\",
            route: \\"/en/docs/advanced/code-highlighting\\"
          }, {
            name: \\"dynamic-markdown-import\\",
            route: \\"/en/docs/advanced/dynamic-markdown-import\\"
          }, {
            name: \\"file-name.with.DOTS\\",
            route: \\"/en/docs/advanced/file-name.with.DOTS\\"
          }, {
            name: \\"images\\",
            route: \\"/en/docs/advanced/images\\"
          }, {
            name: \\"markdown-import\\",
            route: \\"/en/docs/advanced/markdown-import\\"
          }, {
            name: \\"more\\",
            route: \\"/en/docs/advanced/more\\",
            children: [{
              name: \\"loooooooooooooooooooong-title\\",
              route: \\"/en/docs/advanced/more/loooooooooooooooooooong-title\\"
            }, {
              name: \\"tree\\",
              route: \\"/en/docs/advanced/more/tree\\",
              children: [{
                name: \\"one\\",
                route: \\"/en/docs/advanced/more/tree/one\\"
              }, {
                name: \\"three\\",
                route: \\"/en/docs/advanced/more/tree/three\\"
              }, {
                name: \\"two\\",
                route: \\"/en/docs/advanced/more/tree/two\\"
              }]
            }]
          }, {
            name: \\"performance\\",
            route: \\"/en/docs/advanced/performance\\"
          }, {
            name: \\"react-native\\",
            route: \\"/en/docs/advanced/react-native\\"
          }, {
            name: \\"scrollbar-x\\",
            route: \\"/en/docs/advanced/scrollbar-x\\"
          }]
        }, {
          name: \\"advanced\\",
          route: \\"/en/docs/advanced\\"
        }, {
          name: \\"arguments\\",
          route: \\"/en/docs/arguments\\"
        }, {
          name: \\"callout\\",
          route: \\"/en/docs/callout\\"
        }, {
          name: \\"change-log\\",
          route: \\"/en/docs/change-log\\"
        }, {
          name: \\"code-block-without-language\\",
          route: \\"/en/docs/code-block-without-language\\"
        }, {
          name: \\"conditional-fetching\\",
          route: \\"/en/docs/conditional-fetching\\"
        }, {
          name: \\"custom-header-ids\\",
          route: \\"/en/docs/custom-header-ids\\"
        }, {
          name: \\"data-fetching\\",
          route: \\"/en/docs/data-fetching\\"
        }, {
          name: \\"error-handling\\",
          route: \\"/en/docs/error-handling\\"
        }, {
          name: \\"getting-started\\",
          route: \\"/en/docs/getting-started\\"
        }, {
          name: \\"global-configuration\\",
          route: \\"/en/docs/global-configuration\\"
        }, {
          name: \\"middleware\\",
          route: \\"/en/docs/middleware\\"
        }, {
          name: \\"mutation\\",
          route: \\"/en/docs/mutation\\"
        }, {
          name: \\"options\\",
          route: \\"/en/docs/options\\"
        }, {
          name: \\"pagination\\",
          route: \\"/en/docs/pagination\\"
        }, {
          name: \\"prefetching\\",
          route: \\"/en/docs/prefetching\\"
        }, {
          name: \\"raw-layout\\",
          route: \\"/en/docs/raw-layout\\"
        }, {
          name: \\"revalidation\\",
          route: \\"/en/docs/revalidation\\"
        }, {
          name: \\"suspense\\",
          route: \\"/en/docs/suspense\\"
        }, {
          name: \\"typescript\\",
          route: \\"/en/docs/typescript\\"
        }, {
          name: \\"understanding\\",
          route: \\"/en/docs/understanding\\"
        }, {
          name: \\"with-nextjs\\",
          route: \\"/en/docs/with-nextjs\\"
        }, {
          name: \\"wrap-toc-items\\",
          route: \\"/en/docs/wrap-toc-items\\"
        }]
      }, {
        name: \\"examples\\",
        route: \\"/en/examples\\",
        children: [{
          data: meta4
        }, {
          name: \\"auth\\",
          route: \\"/en/examples/auth\\",
          frontMatter: {
            \\"title\\": \\"Authentication\\",
            \\"full\\": true
          }
        }, {
          name: \\"basic\\",
          route: \\"/en/examples/basic\\",
          frontMatter: {
            \\"title\\": \\"Basic Usage\\",
            \\"full\\": true
          }
        }, {
          name: \\"error-handling\\",
          route: \\"/en/examples/error-handling\\",
          frontMatter: {
            \\"title\\": \\"Error Handling\\",
            \\"full\\": true
          }
        }, {
          name: \\"full\\",
          route: \\"/en/examples/full\\"
        }, {
          name: \\"infinite-loading\\",
          route: \\"/en/examples/infinite-loading\\",
          frontMatter: {
            \\"title\\": \\"Infinite Loading\\",
            \\"full\\": true
          }
        }, {
          name: \\"ssr\\",
          route: \\"/en/examples/ssr\\",
          frontMatter: {
            \\"title\\": \\"Next.js SSR\\",
            \\"full\\": true
          }
        }]
      }, {
        name: \\"foo\\",
        route: \\"/en/foo\\"
      }, {
        name: \\"index\\",
        route: \\"/en\\",
        frontMatter: {
          \\"title\\": \\"React Hooks for Data Fetching\\",
          \\"searchable\\": false
        }
      }, {
        name: \\"remote\\",
        route: \\"/en/remote\\",
        children: [{
          name: \\"graphql-eslint\\",
          route: \\"/en/remote/graphql-eslint\\",
          children: [{
            data: {}
          }]
        }, {
          name: \\"graphql-yoga\\",
          route: \\"/en/remote/graphql-yoga\\",
          children: [{
            data: {}
          }]
        }]
      }, {
        name: \\"test\\",
        route: \\"/en/test\\"
      }];
      export const dynamicMetaModules = {
        '/en/remote/graphql-eslint': meta6,
        '/en/remote/graphql-yoga': meta7
      };
      "
    `)
  })
})

describe('Page Process', () => {
  it.skip("should not add `_meta.json` file if folder doesn't contain markdown files", async () => {
    const { items } = await collectFiles({
      dir: path.join(
        CWD,
        '__test__',
        'fixture',
        'page-maps',
        'folder-without-markdown-files'
      )
    })
    expect(items).toEqual([])
  })

  it.skip("should add `_meta.json` file if it's missing", async () => {
    const { items } = await collectFiles({
      dir: path.join(
        CWD,
        '__test__',
        'fixture',
        'page-maps',
        'folder-without-meta-json'
      )
    })
    expect(items).toEqual([
      { name: 'callout', route: '/callout' },
      { name: 'tabs', route: '/tabs' },
      { data: { callout: 'Callout', tabs: 'Tabs' } }
    ])
  })

  it.skip('should resolve symlinked files and directories', async () => {
    const { items } = await collectFiles({
      dir: path.join(
        CWD,
        '__test__',
        'fixture',
        'page-maps',
        'folder-with-symlinks',
        'pages'
      )
    })
    expect(items).toEqual([
      {
        name: 'docs',
        route: '/docs',
        children: [
          { name: 'test2', route: '/docs/test2' },
          { data: { test2: 'Test2' } }
        ]
      },
      { name: 'test1', route: '/test1' },
      { data: { test1: 'Test1' } }
    ])
  })

  it('should match i18n site page maps', async () => {
    const chunksPath = path.join(
      CWD,
      '..',
      '..',
      'examples',
      'swr-site',
      '.next',
      'static',
      'chunks'
    )
    const { pageMap: enPageMap } = await import(
      chunksPath + '/nextra-page-map-en.mjs'
    )
    const { pageMap: esPageMap } = await import(
      chunksPath + '/nextra-page-map-es.mjs'
    )
    const { pageMap: ruPageMap } = await import(
      chunksPath + '/nextra-page-map-ru.mjs'
    )
    expect({ enPageMap, esPageMap, ruPageMap }).toMatchSnapshot()
  })
})
