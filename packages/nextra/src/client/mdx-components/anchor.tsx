import cn from 'clsx'
import Link from 'next/link'
import type { ComponentPropsWithoutRef, FC } from 'react'
import { EXTERNAL_URL_RE } from '../../server/constants.js'
import { LinkArrowIcon } from '../icons/index.js'

export const Anchor: FC<ComponentPropsWithoutRef<'a'>> = ({
  href = '',
  ...props
}) => {
  const combinedProps = {
    ...props,
    className: cn('x:focus-visible:nextra-focus', props.className)
  }
  if (
    !combinedProps.target &&
    !combinedProps.rel &&
    EXTERNAL_URL_RE.test(href)
  ) {
    const { children } = combinedProps
    return (
      <a href={href} target="_blank" rel="noreferrer" {...combinedProps}>
        {children}
        {typeof children === 'string' && (
          <>
            &thinsp;
            <LinkArrowIcon
              // based on font-size
              height="1em"
              className="x:inline x:align-baseline x:shrink-0"
            />
          </>
        )}
      </a>
    )
  }
  return <Link href={href} {...combinedProps} />
}
