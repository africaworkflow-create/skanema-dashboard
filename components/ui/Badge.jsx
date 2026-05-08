import { cn } from '@/lib/utils'

export function Badge({ children, variant = 'gray' }) {
  const variants = {
    green : 'bg-green-50 text-green-700',
    amber : 'bg-amber-50 text-amber-700',
    blue  : 'bg-blue-50 text-blue-700',
    red   : 'bg-red-50 text-red-600',
    gray  : 'bg-gray-100 text-gray-600',
    black : 'bg-gray-900 text-white',
  }
  return (
    <span className={cn('inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full', variants[variant])}>
      {children}
    </span>
  )
}
