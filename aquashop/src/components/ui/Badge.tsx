import { classNames } from '@/lib/utils'
import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray'
  children: ReactNode
  className?: string
}

const variantMap: Record<string, string> = {
  primary: 'bg-blue-100 text-primary',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger:  'bg-red-100 text-red-700',
  gray:    'bg-gray-100 text-gray-600',
}

export function Badge({ variant = 'primary', children, className = '' }: BadgeProps) {
  return (
    <span className={classNames('badge', variantMap[variant], className)}>
      {children}
    </span>
  )
}

export default Badge
