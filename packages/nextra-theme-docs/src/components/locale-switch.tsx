'use client'

import { addBasePath } from 'next/dist/client/add-base-path'
import { usePathname } from 'next/navigation'
import { Select } from 'nextra/components'
import { GlobeIcon } from 'nextra/icons'
import type { ReactElement } from 'react'
import { useThemeConfig } from '../stores'

const ONE_YEAR = 365 * 24 * 60 * 60 * 1_000

interface LocaleSwitchProps {
  lite?: boolean
  className?: string
}

export function LocaleSwitch({
  lite,
  className
}: LocaleSwitchProps): ReactElement | null {
  const { i18n } = useThemeConfig()
  const pathname = usePathname()
  if (!i18n.length) return null

  const locale = pathname.split('/')[1]
  const selected = i18n.find(l => locale === l.locale)
  return (
    <Select
      title="Change language"
      className={className}
      onChange={option => {
        const date = new Date(Date.now() + ONE_YEAR)
        document.cookie = `NEXT_LOCALE=${
          option.key
        }; expires=${date.toUTCString()}; path=/`
        location.href = addBasePath(
          pathname.replace(`/${locale}`, `/${option.key}`)
        )
      }}
      selected={{
        key: selected?.locale || '',
        name: (
          <span className="_flex _items-center _gap-2">
            <GlobeIcon height="12" />
            {!lite && selected?.name}
          </span>
        )
      }}
      options={i18n.map(l => ({
        key: l.locale,
        name: l.name
      }))}
    />
  )
}
