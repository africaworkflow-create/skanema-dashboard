'use client'
import { cn } from '@/lib/utils'

export function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        'relative inline-flex w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0',
        'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-900',
        checked   ? 'bg-gray-900'  : 'bg-gray-200',
        disabled  && 'opacity-50 cursor-not-allowed',
        !disabled && 'cursor-pointer'
      )}
    >
      <span
        className={cn(
          'absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-1'
        )}
      />
    </button>
  )
}
