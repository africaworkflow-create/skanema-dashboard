import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function MetricCard({ label, value, delta, deltaLabel, icon: Icon, accent }) {
  const positive = delta > 0
  const neutral  = delta === 0 || delta === undefined

  return (
    <div className={cn('bg-white border border-gray-100 rounded-xl p-4 sm:p-5', accent && 'border-l-2 border-l-gray-900')}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-gray-400 font-medium">{label}</span>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center">
            <Icon size={14} className="text-gray-400" />
          </div>
        )}
      </div>
      <div className="text-2xl font-semibold text-gray-900 leading-none mb-2">
        {value}
      </div>
      {(delta !== undefined || deltaLabel) && (
        <div className={cn(
          'flex items-center gap-1 text-xs',
          neutral  ? 'text-gray-400'  :
          positive ? 'text-green-600' : 'text-red-500'
        )}>
          {neutral  ? <Minus size={12} />        :
           positive ? <TrendingUp size={12} />   :
                      <TrendingDown size={12} />}
          <span>
            {delta !== undefined && `${positive ? '+' : ''}${delta}% `}
            {deltaLabel}
          </span>
        </div>
      )}
    </div>
  )
}
