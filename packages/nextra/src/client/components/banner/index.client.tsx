'use client'

import cn from 'clsx'
import type { ReactElement, ReactNode } from 'react'
import { Button } from '../button.js'

export function CloseBannerButton({
  storageKey,
  children
}: {
  storageKey: string
  children: ReactNode
}): ReactElement {
  return (
    <Button
      aria-label="Dismiss banner"
      className={({ hover }) =>
        cn('_p-2', hover ? '_opacity-100' : '_opacity-80')
      }
      onClick={event => {
        event.currentTarget.parentElement!.classList.add('_hidden')
        try {
          localStorage.setItem(storageKey, '1')
        } catch {
          /* ignore */
        }
      }}
    >
      {children}
    </Button>
  )
}
