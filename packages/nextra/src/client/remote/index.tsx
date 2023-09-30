/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */
import * as mdx from '@mdx-js/react'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { jsxRuntime } from './jsx-runtime.cjs'

if (typeof window !== 'undefined') {
  window.requestIdleCallback ||= cb => {
    const start = Date.now()
    return window.setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start))
        }
      })
    }, 1)
  }

  window.cancelIdleCallback ||= clearTimeout
}

/**
 * Represents the return value of a call to serialize()
 */
export type MDXRemoteSerializeResult<
  TScope = Record<string, unknown>,
  TFrontmatter = Record<string, unknown>
> = {
  /**
   * The compiledSource, generated from next-mdx-remote/serialize
   */
  compiledSource: string
  /**
   * An arbitrary object of data which will be supplied to the MDX.
   *
   * For example, in cases where you want to provide template variables to the MDX, like `my name is {name}`,
   * you could provide scope as `{ name: "Some name" }`.
   */
  scope: TScope
  /**
   * If parseFrontmatter was set to true, contains any parsed frontmatter found in the MDX source.
   */
  frontmatter: TFrontmatter
}

export type MDXRemoteProps<
  TScope = Record<string, unknown>,
  TFrontmatter = Record<string, unknown>
> = MDXRemoteSerializeResult<TScope, TFrontmatter> & {
  /**
   * An object mapping names to React components.
   * The key used will be the name accessible to MDX.
   *
   * For example: `{ ComponentName: Component }` will be accessible in the MDX as `<ComponentName/>`.
   */
  components?: React.ComponentProps<typeof mdx.MDXProvider>['components']
  /**
   * Determines whether the content should be hydrated asynchronously, or "lazily"
   */
  lazy?: boolean
}

/**
 * Renders compiled source from next-mdx-remote/serialize.
 */
export function MDXRemote<TScope, TFrontmatter>({
  compiledSource,
  frontmatter,
  scope,
  components = {},
  lazy
}: MDXRemoteProps<TScope, TFrontmatter>) {
  const [isReadyToRender, setIsReadyToRender] = useState(
    !lazy || typeof window === 'undefined'
  )

  // if we're on the client side and `lazy` is set to true, we hydrate the
  // mdx content inside requestIdleCallback, allowing the page to get to
  // interactive quicker, but the mdx content to hydrate slower.
  useEffect(() => {
    if (lazy) {
      const handle = window.requestIdleCallback(() => {
        setIsReadyToRender(true)
      })
      return () => window.cancelIdleCallback(handle)
    }
  }, [])

  const Content = useMemo(() => {
    // if we're ready to render, we can assemble the component tree and let React do its thing
    // first we set up the scope which has to include the mdx custom
    // create element function as well as any components we're using
    const fullScope = {
      opts: { ...mdx, ...jsxRuntime },
      frontmatter,
      ...scope
    }
    const keys = Object.keys(fullScope)
    const values = Object.values(fullScope)
    // now we eval the source code using a function constructor
    // in order for this to work we need to have React, the mdx createElement,
    // and all our components in scope for the function, which is the case here
    // we pass the names (via keys) in as the function's args, and execute the
    // function with the actual values.
    console.log({ compiledSource })
    const hydrateFn = Reflect.construct(Function, keys.concat(compiledSource))
    const result = hydrateFn.apply(hydrateFn, values)

    console.log(111, { result }, result.useTOC())

    return result.default
  }, [scope, compiledSource])

  if (!isReadyToRender) {
    // If we're not ready to render, return an empty div to preserve SSR'd markup
    return (
      <div dangerouslySetInnerHTML={{ __html: '' }} suppressHydrationWarning />
    )
  }
  // wrapping the content with MDXProvider will allow us to customize the standard
  // markdown components (such as "h1" or "a") with the "components" object
  const content = (
    <mdx.MDXProvider components={components}>
      <Content />
    </mdx.MDXProvider>
  )
  // If lazy = true, we need to render a wrapping div to preserve the same markup structure that was SSR'd
  console.log({ content, compiledSource })

  // If lazy = true, we need to render a wrapping div to preserve the same markup structure that was SSR'd
  return lazy ? <div>{content}</div> : content
}
