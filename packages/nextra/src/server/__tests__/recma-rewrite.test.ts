import { clean } from '../../../__test__/test-utils.js'
import { compileMdx } from '../compile.js'

describe('recma-rewrite', () => {
  const testMdx = `
# h1
# h2
# h3

- list 1
- list 2
  `

  const testMdxWithDefaultExport = `${testMdx}

export const components = {
  h1: () => null
}

export default function Hello(props) {
  return <div>Default Export {props.children}</div>
}
`

  describe("outputFormat: 'function-body'",  () => {
    it('should work', async() => {
      const rawMdx = await compileMdx(testMdx)
      expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
      "'use strict'
      const { Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs } = arguments[0]
      const metadata = {
        title: 'h1'
      }
      const toc = []
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          li: 'li',
          ul: 'ul',
          ...props.components
        }
        return _jsxs(_Fragment, {
          children: [
            _jsx(_components.h1, {
              children: 'h1'
            }),
            '\\n',
            _jsx(_components.h1, {
              children: 'h2'
            }),
            '\\n',
            _jsx(_components.h1, {
              children: 'h3'
            }),
            '\\n',
            _jsxs(_components.ul, {
              children: [
                '\\n',
                _jsx(_components.li, {
                  children: 'list 1'
                }),
                '\\n',
                _jsx(_components.li, {
                  children: 'list 2'
                }),
                '\\n'
              ]
            })
          ]
        })
      }
      return {
        metadata,
        toc,
        default: _createMdxContent
      }"
    `)
    })
    it('should work with `export default` and `export const components`', async() => {
      const rawMdx = await compileMdx(testMdxWithDefaultExport)
      expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
        "'use strict'
        const { Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs } = arguments[0]
        const metadata = {
          title: 'h1'
        }
        const components = {
          h1: () => null
        }
        const MDXLayout = function Hello(props) {
          return _jsxs('div', {
            children: ['Default Export ', props.children]
          })
        }
        const toc = []
        function _createMdxContent(props) {
          const _components = {
            h1: 'h1',
            li: 'li',
            ul: 'ul',
            ...props.components
          }
          return _jsxs(_Fragment, {
            children: [
              _jsx(_components.h1, {
                children: 'h1'
              }),
              '\\n',
              _jsx(_components.h1, {
                children: 'h2'
              }),
              '\\n',
              _jsx(_components.h1, {
                children: 'h3'
              }),
              '\\n',
              _jsxs(_components.ul, {
                children: [
                  '\\n',
                  _jsx(_components.li, {
                    children: 'list 1'
                  }),
                  '\\n',
                  _jsx(_components.li, {
                    children: 'list 2'
                  }),
                  '\\n'
                ]
              })
            ]
          })
        }
        function MDXContent(props = {}) {
          return _jsx(MDXLayout, {
            ...props,
            children: _jsx(_createMdxContent, {
              ...props
            })
          })
        }
        return {
          metadata,
          components,
          toc,
          default: MDXContent
        }"
      `)
      })
  })

  describe("outputFormat: 'program'",  () => {
    it('should work', async() => {

    const rawMdx = await compileMdx(testMdx, {
      mdxOptions: {
        outputFormat: 'program',
        jsx: true
      }
    })
    expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
      "/*@jsxRuntime automatic*/
      /*@jsxImportSource react*/
      export const metadata = {
        title: 'h1'
      }
      export const toc = []
      function MDXLayout(props) {
        const _components = {
          h1: 'h1',
          li: 'li',
          ul: 'ul',
          ...props.components
        }
        return (
          <>
            <_components.h1>{'h1'}</_components.h1>
            {'\\n'}
            <_components.h1>{'h2'}</_components.h1>
            {'\\n'}
            <_components.h1>{'h3'}</_components.h1>
            {'\\n'}
            <_components.ul>
              {'\\n'}
              <_components.li>{'list 1'}</_components.li>
              {'\\n'}
              <_components.li>{'list 2'}</_components.li>
              {'\\n'}
            </_components.ul>
          </>
        )
      }"
    `)
    })
    it('should work with `export default` and `export const components`', async() => {
      const rawMdx = await compileMdx(testMdxWithDefaultExport)
      expect(clean(rawMdx)).resolves.toMatchInlineSnapshot(`
        "'use strict'
        const { Fragment: _Fragment, jsx: _jsx, jsxs: _jsxs } = arguments[0]
        const metadata = {
          title: 'h1'
        }
        const components = {
          h1: () => null
        }
        const MDXLayout = function Hello(props) {
          return _jsxs('div', {
            children: ['Default Export ', props.children]
          })
        }
        const toc = []
        function _createMdxContent(props) {
          const _components = {
            h1: 'h1',
            li: 'li',
            ul: 'ul',
            ...props.components
          }
          return _jsxs(_Fragment, {
            children: [
              _jsx(_components.h1, {
                children: 'h1'
              }),
              '\\n',
              _jsx(_components.h1, {
                children: 'h2'
              }),
              '\\n',
              _jsx(_components.h1, {
                children: 'h3'
              }),
              '\\n',
              _jsxs(_components.ul, {
                children: [
                  '\\n',
                  _jsx(_components.li, {
                    children: 'list 1'
                  }),
                  '\\n',
                  _jsx(_components.li, {
                    children: 'list 2'
                  }),
                  '\\n'
                ]
              })
            ]
          })
        }
        function MDXContent(props = {}) {
          return _jsx(MDXLayout, {
            ...props,
            children: _jsx(_createMdxContent, {
              ...props
            })
          })
        }
        return {
          metadata,
          components,
          toc,
          default: MDXContent
        }"
      `)
    })
  })
})
