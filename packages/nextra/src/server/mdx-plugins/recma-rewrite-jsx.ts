import type { FunctionDeclaration, Program, ReturnStatement } from 'estree'
import type { JsxAttribute } from 'estree-util-to-js/lib/jsx'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

const HEADING_NAMES = new Set(['h2', 'h3', 'h4', 'h5', 'h6'])

export const recmaRewriteJsx: Plugin<[], Program> =
  () => (ast: Program, file) => {
    const createMdxContent = ast.body.find(
      o =>
        o.type === 'FunctionDeclaration' && o.id!.name === '_createMdxContent'
    ) as FunctionDeclaration

    const returnStatement = createMdxContent.body.body.find(
      o => o.type === 'ReturnStatement'
    ) as ReturnStatement

    const { argument } = returnStatement as any

    // if return statements doesn't wrap in fragment children will be []
    const returnBody = argument.children.length ? argument.children : [argument]

    const tocProperties = file.data.toc as (
      | { properties: { id: string } }
      | string
    )[]

    // Do not add `const toc = useTOC(props)`
    if (!tocProperties.length) return

    visit({ children: returnBody }, 'JSXElement', (heading: any) => {
      const { openingElement } = heading
      const name = openingElement?.name.property?.name
      const isHeading = name && HEADING_NAMES.has(name)
      if (!isHeading) return

      const idNode = openingElement.attributes.find(
        (attr: JsxAttribute) => attr.name.name === 'id'
      )
      if (!idNode) return

      const id = idNode.value.value

      const foundIndex = tocProperties.findIndex(node => {
        if (typeof node === 'string') return
        return node.properties.id === id
      })

      if (foundIndex === -1) return
      idNode.value = {
        type: 'JSXExpressionContainer',
        expression: {
          type: 'Identifier',
          name: `toc[${foundIndex}].id`
        }
      }

      delete openingElement.selfClosing
      heading.children = [
        {
          type: 'JSXExpressionContainer',
          expression: {
            type: 'Identifier',
            name: `toc[${foundIndex}].value`
          }
        }
      ]
      heading.closingElement = {
        ...openingElement,
        type: 'JSXClosingElement',
        attributes: []
      }
    })

    createMdxContent.body.body.unshift({
      type: 'VariableDeclaration',
      kind: 'const',
      declarations: [
        {
          type: 'VariableDeclarator',
          id: { type: 'Identifier', name: 'toc' },
          init: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'useTOC' },
            arguments: [{ type: 'Identifier', name: 'props' }],
            optional: false
          }
        }
      ]
    })
  }
