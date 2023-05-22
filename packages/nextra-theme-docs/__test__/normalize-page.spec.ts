import { describe, it, expect } from 'vitest'
import { cnPageMap, usPageMap } from './__fixture__/pageMap'
import { normalizePages } from 'nextra/normalize-pages'

const defaultLocale = 'en-US'

describe('normalize-page', () => {
  it('zh-CN home', () => {
    const locale = 'zh-CN'
    const result = normalizePages({
      list: cnPageMap,
      locale,
      defaultLocale,
      route: '/'
    })
    expect(result).toMatchSnapshot()
  })

  it('zh-CN getting-started', () => {
    const locale = 'zh-CN'
    const result = normalizePages({
      list: cnPageMap,
      locale,
      defaultLocale,
      route: '/docs/getting-started'
    })
    expect(result).toMatchSnapshot()
  })

  it('en-US home', () => {
    const locale = 'en-US'
    const result = normalizePages({
      list: usPageMap,
      locale,
      defaultLocale,
      route: '/'
    })
    expect(result).toMatchSnapshot()
  })

  it('en-US getting-started', () => {
    const locale = 'en-US'
    const result = normalizePages({
      list: usPageMap,
      locale,
      defaultLocale,
      route: '/docs/getting-started'
    })
    expect(result).toMatchSnapshot()
  })

  it('/404 page', () => {
    const result = normalizePages({
      list: [
        { kind: 'MdxPage', name: '404', route: '/404' },
        { kind: 'MdxPage', name: 'get-started', route: '/get-started' },
        { kind: 'MdxPage', name: 'index', route: '/' },
        {
          kind: 'Meta',
          data: {
            '404': {
              type: 'page',
              theme: {
                layout: 'full'
              }
            },
            index: {
              title: 'Introduction'
            },
            'get-started': {
              title: 'Get Started'
            }
          }
        }
      ],
      locale: 'en-US',
      defaultLocale: 'en-US',
      route: '/500ddd'
    })
    expect(result).toMatchSnapshot()
  })

  it('/500 page', () => {
    const result = normalizePages({
      list: [
        { kind: 'MdxPage', name: '500', route: '/500' },
        { kind: 'MdxPage', name: 'get-started', route: '/get-started' },
        { kind: 'MdxPage', name: 'index', route: '/' },
        {
          kind: 'Meta',
          data: {
            '500': {
              type: 'page',
              theme: {
                layout: 'raw'
              }
            },
            index: {
              title: 'Introduction'
            },
            'get-started': {
              title: 'Get Started'
            }
          }
        }
      ],
      locale: 'en-US',
      defaultLocale: 'en-US',
      route: '/500'
    })
    expect(result).toMatchSnapshot()
  })

  it('should ', () => {
    const result = normalizePages({
      list: [
        {
          kind: 'Meta',
          data: {
            index: {
              type: 'page',
              title: 'Nextra',
              display: 'hidden',
              theme: {
                layout: 'raw'
              }
            },
            docs: {
              type: 'page',
              title: 'Documentation'
            },
            explorers: {
              title: 'Explorers',
              type: 'menu',
            },
            showcase: {
              type: 'page',
              title: 'Showcase',
              theme: {
                typesetting: 'article',
                layout: 'full'
              }
            },
            explorers2: {
              title: 'Explorers2',
              type: 'menu',
            },
            about: {
              type: 'page',
              title: 'About',
              theme: {
                typesetting: 'article'
              }
            },
            explorers3: {
              title: 'Explorers3',
              type: 'menu',
            }
          }
        },
        {
          kind: 'MdxPage',
          name: 'about',
          route: '/about'
        },
        {
          kind: 'MdxPage',
          name: 'showcase',
          route: '/showcase'
        }
      ],
      locale: 'en-US',
      route: '/docs'
    })
    expect(result.topLevelNavbarItems).toMatchInlineSnapshot(`
      [
        {
          "name": "docs",
          "route": "",
          "title": "Documentation",
          "type": "page",
        },
        {
          "name": "explorers",
          "route": "",
          "title": "Explorers",
          "type": "menu",
        },
        {
          "kind": "MdxPage",
          "name": "showcase",
          "route": "/showcase",
          "theme": {
            "layout": "full",
            "typesetting": "article",
          },
          "title": "Showcase",
          "type": "page",
        },
        {
          "name": "explorers2",
          "route": "",
          "title": "Explorers2",
          "type": "menu",
        },
        {
          "kind": "MdxPage",
          "name": "about",
          "route": "/about",
          "theme": {
            "typesetting": "article",
          },
          "title": "About",
          "type": "page",
        },
        {
          "name": "explorers3",
          "route": "#",
          "title": "Explorers3",
          "type": "menu",
        },
      ]
    `)
  })
})
