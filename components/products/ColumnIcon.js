'use client'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'

const BREAKPOINT_COLUMNS = {
  desktop: 6,
  laptop: 5,
  large: 4,
  medium: 3,
  mobile: 2,
}

const ColumnIcons = () => {

  const router = useRouter()
  const searchParams = useSearchParams()

  // Media queries
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isNineTwo = useMediaQuery('(max-width: 1279px)')
  const isFiveThou = useMediaQuery('(max-width: 1536px)')

  const columnNumber = Number(searchParams.get('col'))

  const updateColumn = (col) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('col', String(col))
    router.push(`?${params.toString()}`)
  }

  // Auto adjust column based on screen size
  useEffect(() => {
    if (!columnNumber) return

    let nextCol = columnNumber

    if (isMobile) {
      nextCol = BREAKPOINT_COLUMNS.mobile 
    } else if (isNineTwo) {
      nextCol = BREAKPOINT_COLUMNS.medium 
    } else if (isFiveThou) {
      nextCol = BREAKPOINT_COLUMNS.large 
    }

    if (nextCol !== columnNumber) {
      updateColumn(nextCol)
    }
  }, [isMobile, isNineTwo, isFiveThou])

  const availableColumns = useMemo(() => {
    if (isFiveThou) return [3, 4]
    return [3, 4, 5, 6]
  }, [isFiveThou])

  if (isMobile) return null

  return (
    <div className="flex gap-2">
      {availableColumns.map((col) => (
        <button
          key={col}
          type="button"
          onClick={() => updateColumn(col)}
          className="flex gap-0.5 border border-black p-0.5"
        >
          {Array.from({ length: col }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-5 w-2 inline-block',
                columnNumber === col ? 'bg-black' : 'bg-gray-600'
              )}
            />
          ))}
        </button>
      ))}
    </div>
  )
}

export default ColumnIcons
