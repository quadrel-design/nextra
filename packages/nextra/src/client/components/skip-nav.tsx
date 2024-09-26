'use client'

/**
 * The code included in this file is inspired by https://github.com/reach/reach-ui/blob/43f450db7bcb25a743121fe31355f2294065a049/packages/skip-nav/src/reach-skip-nav.tsx which is part of the @reach/skip-nav library.
 *
 * @reach/skip-nav is licensed as follows:
 * The MIT License (MIT)
 *
 * Copyright (c) 2018-2023, React Training LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Source: https://github.com/reach/reach-ui/blob/43f450db7bcb25a743121fe31355f2294065a049/LICENSE
 */
import { Button } from '@headlessui/react'
import type { ButtonProps } from '@headlessui/react'
import cn from 'clsx'
import type { ComponentProps, FC } from 'react'

const DEFAULT_ID = 'nextra-skip-nav'
const DEFAULT_LABEL = 'Skip to Content'

export const SkipNavLink: FC = ({
  // Give the option to the user to pass a falsy other than undefined to remove the default styles
  className,
  id = DEFAULT_ID,
  children = DEFAULT_LABEL
}: Pick<ButtonProps, 'className' | 'id' | 'children'>) => (
  <Button
    as="a"
    href={`#${id}`}
    className={({ focus }) =>
      cn(
        'nextra-skip-nav',
        focus
          ? 'nextra-focus _fixed _z-50 _my-3 _mx-4 _rounded-lg _px-3 _py-2 _text-sm _font-bold _bg-[rgb(var(--nextra-bg))] _border _border-current'
          : '_sr-only',
        className
      )
    }
  >
    {children}
  </Button>
)

export const SkipNavContent: FC<Pick<ComponentProps<'div'>, 'id'>> = ({
  id = DEFAULT_ID
}) => <div id={id} />
