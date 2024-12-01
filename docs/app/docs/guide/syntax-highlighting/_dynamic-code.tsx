'use client'

import { Button } from 'nextra/components'
import type { FC, ReactNode } from 'react'
import { useEffect, useRef } from 'react'

export const DynamicCode: FC<{ children: ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null!)
  const tokenRef = useRef<HTMLSpanElement>()
  // Find the corresponding token from the DOM
  useEffect(() => {
    tokenRef.current = [
      ...(ref.current.querySelectorAll(
        'code > span > span'
      ) as NodeListOf<HTMLSpanElement>)
    ].find(el => el.textContent === '1')
  }, [])
  return (
    <>
      <div ref={ref} className="mt-6">
        {children}
      </div>
      <div className="mt-3 flex justify-center gap-3 text-sm">
        <Button
          variant="outline"
          onClick={() => {
            const token = tokenRef.current!
            const prev = token.textContent!
            token.textContent = String((+prev || 0) + 1)
          }}
        >
          Increase the number
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            tokenRef.current!.textContent = '1 + 1'
          }}
        >
          Change to `1 + 1`
        </Button>
      </div>
    </>
  )
}
