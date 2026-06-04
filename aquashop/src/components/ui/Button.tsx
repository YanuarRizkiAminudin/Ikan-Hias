import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { classNames } from '@/lib/utils'
import Spinner from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'wa' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

const variantMap: Record<string, string> = {
  primary:   'bg-accent text-white hover:bg-orange-600 focus:ring-accent',
  secondary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
  wa:        'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
  ghost:     'bg-transparent text-primary border border-primary hover:bg-blue-50 focus:ring-primary',
  danger:    'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
}

const sizeMap: Record<string, string> = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={classNames(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-full',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantMap[variant],
        sizeMap[size],
        className,
      )}
    >
      {loading && <Spinner size="sm" className="border-white border-t-transparent" />}
      {children}
    </button>
  )
}

export default Button
