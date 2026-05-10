'use client'
import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { MetricCard } from '@/components/ui/MetricCard'
import { getStats } from '@/lib/api'
import { formatFCFA } from '@/lib/utils'
import { Loader2, TrendingUp, ShoppingBag, Award, CreditCard } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line
} from 'recharts'

const DAYS_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']

function buildWeekData(revenueByDay = []) {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    const found   = revenueByDay.find(r => r._id === dateStr)
    return {
      day : DAYS_FR[d.getDay()],
      CA  : found?.CA    || 0,
      cmds: found?.count || 0,
    }
  })
}

function buildMonthData(revenueByDay = []) {
  const today = new Date()
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (29 - i))
    const dateStr = d.toISOString().split('T')[0]
    const found   = revenueByDay.find(r => r._id === dateStr)
    return {
      j   : `J${i + 1}`,
      CA  : found?.CA    || 0,
      cmds: found?.count || 0,
    }
  })
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 text-xs shadow-sm">
      <p className="font-medium text-gray-900 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-gray-500">
          {p.name === 'CA' ? formatFCFA(p.value) : `${p.value} commande${p.value > 1 ? 's' : ''}`}
        </p>
      ))}
    </div>
  )
}

export default function StatistiquesPage() {
  const [stats,     setStats]     = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [period,    setPeriod]    = useState('week')
  const [weekData,  setWeekData]  = useState([])
  const [monthData, setMonthData] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getStats()
        const d   = res.data.data
        setStats(d)
        setWeekData(buildWeekData(d?.revenueByDay   || []))
        setMonthData(buildMonthData(d?.revenueByDay || []))
      } catch (_) {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  const chartData = period === 'week' ? weekData : monthData
  const xKey      = period === 'week' ? 'day' : 'j'
  const totalCA   = chartData.reduce((s, d) => s + d.CA, 0)

  return (
    <DashboardLayout title="Statistiques" subtitle="Analyse de vos performances">
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={22} className="animate-spin text-gray-300" />
        </div>
      ) : (
        <div className="space-y-5">

          {/* Métriques clés */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard
              label="CA total"
              value={formatFCFA(stats?.totalRevenue || 0)}
              icon={TrendingUp}
              accent
            />
            <MetricCard
              label="Total commandes"
              value={stats?.totalOrders || 0}
              icon={ShoppingBag}
            />
            <MetricCard
              label="Aujourd'hui"
              value={stats?.todayOrders || 0}
              icon={CreditCard}
            />
            <MetricCard
              label="Plat n°1"
              value={stats?.topItems?.[0]?.count || 0}
              deltaLabel={stats?.topItems?.[0]?._id?.substring(0, 12) || '—'}
              icon={Award}
            />
          </div>

          {/* Graphique CA */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <p className="text-sm font-medium text-gray-900">Chiffre d'affaires</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {totalCA > 0 ? formatFCFA(totalCA) + ' sur la période' : 'Aucune commande sur la période'}
                </p>
              </div>
              <div className="flex bg-gray-100 rounded-lg p-0.5 w-fit">
                {['week','month'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    {p === 'week' ? '7 jours' : '30 jours'}
                  </button>
                ))}
              </div>
            </div>
            {totalCA === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-sm text-gray-500">Aucune donnée sur cette période</p>
                <p className="text-xs text-gray-400 mt-1">Les statistiques apparaîtront dès vos premières commandes</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={period === 'week' ? 32 : 8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                  <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                  <Bar dataKey="CA" name="CA" radius={[4,4,0,0]} fill="#111827" opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Commandes + top plats */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            {/* Évolution commandes */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <p className="text-sm font-medium text-gray-900 mb-1">Nombre de commandes</p>
              <p className="text-xs text-gray-400 mb-5">
                {chartData.reduce((s, d) => s + d.cmds, 0)} commande{chartData.reduce((s, d) => s + d.cmds, 0) > 1 ? 's' : ''} sur la période
              </p>
              {chartData.every(d => d.cmds === 0) ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-gray-400">Aucune commande sur cette période</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                    <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="cmds" name="cmds" stroke="#111827" strokeWidth={2}
                          dot={false} activeDot={{ r: 4, fill: '#111827' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Top plats */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <p className="text-sm font-medium text-gray-900 mb-5">Plats les plus commandés</p>
              {!stats?.topItems?.length ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-4xl mb-3">🍽️</div>
                  <p className="text-sm text-gray-400">Aucune donnée disponible</p>
                  <p className="text-xs text-gray-300 mt-1">Apparaît dès vos premières commandes</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.topItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-300 w-4 flex-shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-900 truncate">{item._id}</span>
                          <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{item.count}×</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width     : `${Math.round((item.count / stats.topItems[0].count) * 100)}%`,
                              background: '#111827',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
