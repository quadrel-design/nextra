import { compileMdx } from '../src/server/compile.js'
import { clean } from './test-utils.js'

const options = {
  mdxOptions: { jsx: true },
  latex: true
}

describe('latex', () => {
  it('should convert ```math code block language', async () => {
    const { result } = await compileMdx('```math\nx^2\n```', options)
    expect(clean(result)).resolves.toMatchInlineSnapshot(`
      "const { useMDXComponents: _provideComponents } = arguments[0]
      const title = ''
      const frontMatter = {}
      function useTOC(props) {
        return []
      }
      function _createMdxContent(props) {
        const _components = Object.assign(
          {
            span: 'span',
            math: 'math',
            semantics: 'semantics',
            mrow: 'mrow',
            msup: 'msup',
            mi: 'mi',
            mn: 'mn',
            annotation: 'annotation'
          },
          _provideComponents(),
          props.components
        )
        return (
          <_components.span className=\\"katex-display\\">
            <_components.span className=\\"katex\\">
              <_components.span className=\\"katex-mathml\\">
                <_components.math xmlns=\\"http://www.w3.org/1998/Math/MathML\\" display=\\"block\\">
                  <_components.semantics>
                    <_components.mrow>
                      <_components.msup>
                        <_components.mi>{'x'}</_components.mi>
                        <_components.mn>{'2'}</_components.mn>
                      </_components.msup>
                    </_components.mrow>
                    <_components.annotation encoding=\\"application/x-tex\\">{'x^2\\\\n'}</_components.annotation>
                  </_components.semantics>
                </_components.math>
              </_components.span>
              <_components.span className=\\"katex-html\\" aria-hidden=\\"true\\">
                <_components.span className=\\"base\\">
                  <_components.span
                    className=\\"strut\\"
                    style={{
                      height: '0.8641em'
                    }}
                  />
                  <_components.span className=\\"mord\\">
                    <_components.span className=\\"mord mathnormal\\">{'x'}</_components.span>
                    <_components.span className=\\"msupsub\\">
                      <_components.span className=\\"vlist-t\\">
                        <_components.span className=\\"vlist-r\\">
                          <_components.span
                            className=\\"vlist\\"
                            style={{
                              height: '0.8641em'
                            }}
                          >
                            <_components.span
                              style={{
                                top: '-3.113em',
                                marginRight: '0.05em'
                              }}
                            >
                              <_components.span
                                className=\\"pstrut\\"
                                style={{
                                  height: '2.7em'
                                }}
                              />
                              <_components.span className=\\"sizing reset-size6 size3 mtight\\">
                                <_components.span className=\\"mord mtight\\">{'2'}</_components.span>
                              </_components.span>
                            </_components.span>
                          </_components.span>
                        </_components.span>
                      </_components.span>
                    </_components.span>
                  </_components.span>
                </_components.span>
              </_components.span>
            </_components.span>
          </_components.span>
        )
      }
      return {
        title,
        frontMatter,
        useTOC,
        default: _createMdxContent
      }
      "
    `)
  })

  it('should use mathjax', async () => {
    const { result } = await compileMdx('```math\nx^2\n```', {
      mdxOptions: { jsx: true, outputFormat: 'program' },
      latex: { renderer: 'mathjax' }
    })
    expect(clean(result)).resolves.toMatchInlineSnapshot(`
      "import { useMDXComponents as _provideComponents } from 'nextra/mdx'
      const title = ''
      const frontMatter = {}
      export function useTOC(props) {
        return []
      }
      function MDXLayout(props) {
        const { MathJaxContext, MathJax } = Object.assign({}, _provideComponents(), props.components)
        if (!MathJax) _missingMdxReference('MathJax', true)
        if (!MathJaxContext) _missingMdxReference('MathJaxContext', true)
        return (
          <MathJaxContext>
            {'\\\\n'}
            {'\\\\n'}
            <MathJax>{'\\\\\\\\[x^2\\\\n\\\\\\\\]'}</MathJax>
          </MathJaxContext>
        )
      }
      function _missingMdxReference(id, component) {
        throw new Error(
          'Expected ' +
            (component ? 'component' : 'object') +
            ' \`' +
            id +
            '\` to be defined: you likely forgot to import, pass, or provide it.'
        )
      }
      "
    `)
  })
})
