import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react'
import cn from 'clsx'
import { CheckIcon } from 'nextra/icons'
import type { ReactElement } from 'react'

interface MenuOption {
  key: string
  name: ReactElement | string
}

interface MenuProps {
  selected: MenuOption
  onChange: (option: MenuOption) => void
  options: MenuOption[]
  title?: string
  className?: string
}

export function Select({
  options,
  selected,
  onChange,
  title,
  className
}: MenuProps): ReactElement {
  return (
    <Listbox value={selected} onChange={onChange}>
      <ListboxButton
        title={title}
        className={cn(
          '_h-7 _rounded-md _px-2 _text-left _text-xs _font-medium _text-gray-600 _transition-colors dark:_text-gray-400',
          'data-[open]:_bg-gray-200 data-[open]:_text-gray-900 data-[open]:dark:_bg-primary-100/10 data-[open]:dark:_text-gray-50',
          'hover:_bg-gray-100 hover:_text-gray-900 dark:hover:_bg-primary-100/5 dark:hover:_text-gray-50',
          className
        )}
      >
        {selected.name}
      </ListboxButton>
      <ListboxOptions
        as="ul"
        transition
        anchor={{ to: 'top start', gap: 10 }}
        className="motion-reduce:_transition-none _transition-opacity data-[closed]:_opacity-0 data-[open]:_opacity-100 _min-w-[--button-width] _z-20 _max-h-64 _rounded-md _border _border-black/5 _backdrop-blur-lg _bg-[rgb(var(--nextra-bg),.8)] _py-1 _text-sm _shadow-lg dark:_border-white/20"
      >
        {options.map(option => (
          <ListboxOption
            key={option.key}
            value={option}
            as="li"
            className={cn(
              'data-[focus]:_bg-primary-50 data-[focus]:_text-primary-600 data-[focus]:dark:_bg-primary-500/10',
              '_text-gray-800 dark:_text-gray-100',
              '_cursor-pointer _whitespace-nowrap _py-1.5 _px-3',
              '_transition-colors',
              option.key === selected.key &&
                '_flex _items-center _justify-between _gap-3'
            )}
          >
            {option.name}
            {option.key === selected.key && <CheckIcon />}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
