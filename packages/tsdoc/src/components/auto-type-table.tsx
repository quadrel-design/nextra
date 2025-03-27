import { compileMdx } from 'nextra/compile'
import { MDXRemote } from 'nextra/mdx-remote'
import type { ComponentProps, ReactNode } from 'react'
import type { GenerateDocumentationOptions } from '../base.js'
import { getProject } from '../get-project.js'
import type { BaseTypeTableProps } from '../type-table.js'
import { getTypeTableOutput } from '../type-table.js'
import { TSDoc } from './tsdoc.js'

interface AutoTypeTableProps extends BaseTypeTableProps {
  /**
   * Override the function to render markdown into JSX nodes
   */
  renderMarkdown?: typeof renderMarkdownDefault
  typeLinkMap?: ComponentProps<typeof TSDoc>['typeLinkMap']
}

export function createTypeTable(options: GenerateDocumentationOptions = {}): {
  TSDoc: (props: Omit<AutoTypeTableProps, 'options'>) => ReactNode
} {
  const overrideOptions = {
    ...options,
    project: options.project ?? getProject(options.config)
  }

  return {
    TSDoc(props) {
      return <AutoTypeTable {...props} options={overrideOptions} />
    }
  }
}

/**
 * Display properties in an exported interface via Type Table
 */
async function AutoTypeTable({
  renderMarkdown = renderMarkdownDefault,
  typeLinkMap = {},
  ...props
}: AutoTypeTableProps): Promise<ReactNode> {
  const output = await getTypeTableOutput(props)

  return output.map(async item => {
    const entries = item.entries.map(
      async entry =>
        [
          entry.name,
          {
            type: entry.type,
            description: await renderMarkdown(
              entry.description || entry.tags.description || ''
            ),
            default: entry.tags.default || entry.tags.defaultValue,
            required: entry.required
          }
        ] as const
    )

    const type = Object.fromEntries(await Promise.all(entries))

    return (
      <TSDoc
        key={item.name}
        // @ts-expect-error -- fixme
        type={type}
        typeLinkMap={typeLinkMap}
      />
    )
  })
}

async function renderMarkdownDefault(md: string): Promise<ReactNode> {
  if (!md) return
  const rawJs = await compileMdx(md)
  return <MDXRemote compiledSource={rawJs} />
}
