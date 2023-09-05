import { addBasePath } from 'next/dist/client/add-base-path'
import { useRouter } from 'nextra/hooks'
import { GlobeIcon } from 'nextra/icons'
import type { ReactElement } from 'react'
import { useConfig } from '../contexts'
import { Select } from './select'

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000

interface LocaleSwitchProps {
  lite?: boolean
  className?: string
}

export function LocaleSwitch({
  lite,
  className
}: LocaleSwitchProps): ReactElement | null {
  const config = useConfig()
  const { locale, asPath } = useRouter()

  const options = config.i18n
  if (!options.length) return null

  const selected = options.find(l => locale === l.locale)
  return (
    <Select
      title="Change language"
      className={className}
      onChange={option => {
        const date = new Date(Date.now() + ONE_YEAR)
        document.cookie = `NEXT_LOCALE=${
          option.key
        }; expires=${date.toUTCString()}; path=/`
        const href = addBasePath(asPath.replace(`/${locale}`, `/${option.key}`))
        location.href = href
      }}
      selected={{
        key: selected?.locale || '',
        name: (
          <span className="nx-flex nx-items-center nx-gap-2">
            <GlobeIcon />
            <span className={lite ? 'nx-hidden' : ''}>{selected?.name}</span>
          </span>
        )
      }}
      options={options.map(l => ({
        key: l.locale,
        name: l.name
      }))}
    />
  )
}
