import cn from 'clsx'
import type { FC, ReactNode } from 'react'
import { InformationCircleIcon } from '../icons/index.js'

const TypeToEmoji = {
  default: '💡',
  error: '🚫',
  info: <InformationCircleIcon height="20" className="x:mt-1" />,
  warning: '⚠️'
}

type CalloutType = keyof typeof TypeToEmoji

const classes: Record<CalloutType, string> = {
  default: cn(
    'x:border-orange-100 x:bg-orange-50 x:text-orange-800 x:dark:border-orange-400/30 x:dark:bg-orange-400/20 x:dark:text-orange-300'
  ),
  error: cn(
    'x:border-red-200 x:bg-red-100 x:text-red-900 x:dark:border-red-200/30 x:dark:bg-red-900/30 x:dark:text-red-200'
  ),
  info: cn(
    'x:border-blue-200 x:bg-blue-100 x:text-blue-900 x:dark:border-blue-200/30 x:dark:bg-blue-900/30 x:dark:text-blue-200'
  ),
  warning: cn(
    'x:border-yellow-100 x:bg-yellow-50 x:text-yellow-900 x:dark:border-yellow-200/30 x:dark:bg-yellow-700/30 x:dark:text-yellow-200'
  )
}

type CalloutProps = {
  /**
   * Defines the style of the callout and determines the default icon if `emoji` is not provided.
   *
   * If set to `null`, no border, background, or text styling will be applied.
   * @default 'default'
   */
  type?: CalloutType | null
  /**
   * Icon displayed in the callout. Can be a string emoji or a custom React element.
   *
   * Default values based on `type`:
   * - `'💡'` for `type: 'default'`
   * - `'🚫'` for `type: 'error'`
   * - `<InformationCircleIcon />` for `type: 'info'`
   * - `'⚠️'` for `type: 'warning'`
   * @default Determined by `type`
   */
  emoji?: ReactNode
  /** Content to be displayed inside the callout. */
  children: ReactNode
}

export const Callout: FC<CalloutProps> = ({
  children,
  type = 'default',
  emoji = type && TypeToEmoji[type]
}) => {
  return (
    <div
      className={cn(
        'nextra-callout x:overflow-x-auto x:mt-6 x:flex x:rounded-lg x:border x:py-2 x:pe-4',
        'x:contrast-more:border-current!',
        type && classes[type]
      )}
    >
      <div
        className="x:select-none x:text-xl x:ps-3 x:pe-2"
        style={{
          fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
        }}
        data-pagefind-ignore="all"
      >
        {emoji}
      </div>
      <div className="x:w-full x:min-w-0 x:leading-7">{children}</div>
    </div>
  )
}
