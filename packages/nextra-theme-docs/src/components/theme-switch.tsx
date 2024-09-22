'use client'

import { useTheme } from 'next-themes'
import { useMounted } from 'nextra/hooks'
import { MoonIcon, SunIcon } from 'nextra/icons'
import type { ReactElement } from 'react'
import { useThemeConfig } from '../stores'
import { Select } from './select'

type ThemeSwitchProps = {
  lite?: boolean
  className?: string
}

export function ThemeSwitch({
  lite,
  className
}: ThemeSwitchProps): ReactElement {
  const { setTheme, resolvedTheme, theme = '' } = useTheme()
  const mounted = useMounted()
  const config = useThemeConfig()

  const IconToUse = mounted && resolvedTheme === 'dark' ? MoonIcon : SunIcon
  const { options } = config.themeSwitch

  return (
    <Select
      className={className}
      title="Change theme"
      options={[
        { key: 'light', name: options.light },
        { key: 'dark', name: options.dark },
        { key: 'system', name: options.system }
      ]}
      onChange={option => {
        setTheme(option.key)
      }}
      selected={{
        key: theme,
        name: (
          <span className="_flex _items-center _gap-2 _capitalize">
            <IconToUse height="12" />
            <span className={lite ? 'md:_hidden' : ''}>
              {mounted ? options[theme as keyof typeof options] : options.light}
            </span>
          </span>
        )
      }}
    />
  )
}
