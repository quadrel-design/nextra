import type {
  FunctionDeclaration,
  ObjectExpression,
  Program,
  ReturnStatement,
  SpreadElement
} from 'estree'
import type { JsxAttribute } from 'estree-util-to-js/lib/jsx'
import type { Plugin } from 'unified'

const HEADING_NAMES = new Set(['h2', 'h3', 'h4', 'h5', 'h6'])

export const recmaRewriteJsx: Plugin<[], Program> = () => ast => {
  const createMdxContent = ast.body.find(
    // @ts-expect-error
    o => o.type === 'FunctionDeclaration' && o.id.name === '_createMdxContent'
  ) as FunctionDeclaration
  const returnStatementIndex = createMdxContent.body.body.findIndex(
    o => o.type === 'ReturnStatement'
  )

  const returnStatement = createMdxContent.body.body[
    returnStatementIndex
  ] as ReturnStatement

  // @ts-expect-error
  function isHeading(o): boolean {
    const name = o.openingElement?.name.property?.name
    return name && HEADING_NAMES.has(name)
  }

  // @ts-expect-error
  const headings = returnStatement.argument.children.filter(isHeading)
  const toc = ast.body.find(
    node =>
      node.type === 'ExportNamedDeclaration' &&
      // @ts-expect-error
      node.declaration.declarations[0].id.name === 'toc'
  ) as any

  const tocProperties = toc.declaration.declarations[0].init.elements

  for (const heading of headings) {
    const idNode = heading.openingElement.attributes.find(
      (attr: JsxAttribute) => attr.name.name === 'id'
    )

    const id = idNode.value.value

    const foundIndex = (
      tocProperties as (ObjectExpression | SpreadElement)[]
    ).findIndex(node => {
      if (node.type !== 'ObjectExpression') return
      const object = Object.fromEntries(
        // @ts-expect-error
        node.properties.map(prop => [prop.key.name, prop.value.value])
      )
      return object.id === id
    })

    if (foundIndex === -1) continue

    const valueNode = tocProperties[foundIndex].properties.find(
      // @ts-expect-error
      node => node.key.name === 'value'
    )

    const isMatch = heading.children.some(
      // @ts-expect-error
      node =>
        node.type !== 'JSXExpressionContainer' ||
        node.expression.type !== 'Literal'
    )

    if (isMatch) {
      valueNode.value = {
        type: 'JSXFragment',
        openingFragment: {
          type: 'JSXOpeningFragment',
          attributes: [],
          selfClosing: false
        },
        closingFragment: {
          type: 'JSXClosingFragment'
        },
        children: heading.children
      }
    }

    idNode.value = {
      type: 'JSXExpressionContainer',
      expression: {
        type: 'Identifier',
        name: `toc[${foundIndex}].id`
      }
    }

    heading.children = [
      {
        type: 'JSXExpressionContainer',
        expression: {
          type: 'Identifier',
          name: `toc[${foundIndex}].value`
        }
      }
    ]
  }

  createMdxContent.body.body.splice(returnStatementIndex - 1, 0, {
    type: 'ExpressionStatement',
    expression: {
      type: 'AssignmentExpression',
      operator: '=',
      left: {
        type: 'Identifier',
        name: 'toc'
      },
      right: {
        type: 'ArrayExpression',
        elements: toc.declaration.declarations[0].init.elements
      }
    }
  })

  // Set toc as let and as empty array
  toc.declaration.kind = 'let'
  toc.declaration.declarations[0].init.elements = []
}
