import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-sans tracking-luxury uppercase text-xs transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

    const variants = {
      primary: 'bg-chanel-black text-white hover:bg-chanel-gray-dark focus-visible:ring-chanel-black',
      secondary: 'border border-chanel-black text-chanel-black hover:bg-chanel-black hover:text-white focus-visible:ring-chanel-black',
      ghost: 'text-chanel-gray hover:text-chanel-black focus-visible:ring-chanel-gray',
      danger: 'bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-700',
    }

    const sizes = {
      sm: 'h-8 px-4 text-[10px]',
      md: 'h-11 px-8',
      lg: 'h-13 px-12',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
