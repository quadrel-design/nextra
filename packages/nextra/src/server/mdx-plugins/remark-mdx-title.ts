import path from 'node:path'
import type { Property } from 'estree'
import type { MdxjsEsm } from 'hast-util-to-estree/lib/handlers/mdxjs-esm'
import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { createAstExportConst, pageTitleFromFilename } from '../utils.js'
import { getFlattenedValue } from './remark-headings.js'

function getFrontMatterASTObject(node: MdxjsEsm): Property[] {
  const [n] = node.data!.estree!.body
  return (n as any).declaration.declarations[0].init.properties
}

export const remarkMdxTitle: Plugin<[], Root> = () => (ast, file) => {
  let title = ''
  // @ts-expect-error
  const frontMatterNode = ast.children.find((node: MdxjsEsm) => {
    if (node.type !== 'mdxjsEsm') return
    const [n] = node.data!.estree!.body

    if (n.type !== 'ExportNamedDeclaration') return
    return (n as any).declaration.declarations[0].id.name === 'frontMatter'
  }) as MdxjsEsm

  const frontMatter = getFrontMatterASTObject(frontMatterNode)

  for (const { key, value } of frontMatter) {
    if (key.type === 'Literal' && key.value === 'title') {
      // @ts-expect-error
      title = value.value
      break
    }
    if (key.type === 'Identifier' && key.name === 'title') {
      // @ts-expect-error
      title = value.value
      break
    }
  }

  if (!title) {
    visit(ast, { type: 'heading', depth: 1 }, node => {
      title = getFlattenedValue(node)
      // Stop traversing immediately
      return false
    })
  }
  if (!title) {
    const [filePath] = file.history
    title = pageTitleFromFilename(path.parse(filePath).name)
  }

  ast.children.unshift({
    // @ts-expect-error
    type: 'mdxjsEsm',
    data: {
      estree: {
        body: [createAstExportConst('title', { type: 'Literal', value: title })]
      }
    }
  })
}
