import * as React from 'react'
import {cx} from '@daren/ui-components'

const variantStyles = {
  medium: 'rounded-lg px-1.5 ring-1 ring-inset',
}

const colorStyles = {
  success: {
    small: 'text-emerald-500 dark:text-emerald-400',
    medium:
      'ring-emerald-300 dark:ring-emerald-400/30 bg-emerald-400/10 text-emerald-500 dark:text-emerald-400',
  },
  accent: {
    small: 'text-sky-500',
    medium:
      'ring-sky-300 bg-sky-400/10 text-sky-500 dark:ring-sky-400/30 dark:bg-sky-400/10 dark:text-sky-400',
  },
  warning: {
    small: 'text-amber-500',
    medium:
      'ring-amber-300 bg-amber-400/10 text-amber-500 dark:ring-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400',
  },
  danger: {
    small: 'text-red-500 dark:text-rose-500',
    medium:
      'ring-rose-200 bg-rose-50 text-red-500 dark:ring-rose-500/20 dark:bg-rose-400/10 dark:text-rose-400',
  },
  default: {
    small: 'text-gray-400 dark:text-gray-500',
    medium:
      'ring-gray-200 bg-gray-50 text-gray-500 dark:ring-gray-500/20 dark:bg-gray-400/10 dark:text-gray-400',
  },
}

export function Tag({
  as,
  children,
  variant = 'medium',
  color = 'default',
  ...props
}: JSX.IntrinsicElements['span'] & {
  as?: keyof JSX.IntrinsicElements
  children: string
  variant?: 'small' | 'medium'
  color?: keyof typeof colorStyles
}) {
  const Element = as ?? 'span'

  return (
    <Element
      {...(props as any)}
      className={cx(
        'font-mono text-[0.625rem] font-semibold leading-6',
        variantStyles[variant],
        colorStyles[color][variant],
      )}
    >
      {children}
    </Element>
  )
}
