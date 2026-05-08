'use client'
import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { MetricCard } from '@/components/ui/MetricCard'
import { getStats, getOrders } from '@/lib/api'
import { formatFCFA } from '@/lib/utils'
import { Loader2, TrendingUp, ShoppingBag, Award, CreditCard } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'

const DAYS_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
const COLORS   = ['#111827','#6b7280','#d1d5db','#e5e7eb','#f3f4f6']

function buildWeekData() {
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (6 - i))
    return {
      day : DAYS_FR[d.getDay()],
      CA  : Math.floor(Math.random() * 150000 + 20000),
      cmds: Math.floor(Math.random() * 35 + 2),
    }
  })
}

function buildMonthData() {
  return Array.from({ length: 30 }, (_, i) => ({
    j   : `J${i + 1}`,
    CA  : Math.floor(Math.random() * 200000 + 10000),
    cmds: Math.floor(Math.random() * 40 + 1),
  }))
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2.5 text-xs shadow-sm">
      <p className="font-medium text-gray-900 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-gray-500">
          {p.name === 'CA' ? formatFCFA(p.value) : `${p.value} commandes`}
        </p>
      ))}
    </div>
  )
}

export default function StatistiquesPage() {
  const [stats,     setStats]     = useState(null)
  const [weekData,  setWeekData]  = useState(buildWeekData())
  const [monthData, setMonthData] = useState(buildMonthData())
  const [loading,   setLoading]   = useState(true)
  const [period,    setPeriod]    = useState('week')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getStats()
        setStats(res.data.data)
      } catch (_) {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  const chartData = period === 'week' ? weekData : monthData
  const xKey      = period === 'week' ? 'day' : 'j'

  const pieData = stats?.topItems?.slice(0, 5).map((item, i) => ({
    name : item._id,
    value: item.count,
    color: COLORS[i] || COLORS[4],
  })) || []

  return (
    <DashboardLayout
      title="Statistiques"
      subtitle="Analyse de vos performances"
    >
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
              label="Commandes aujourd'hui"
              value={stats?.todayOrders || 0}
              delta={8}
              deltaLabel="vs hier"
              icon={CreditCard}
            />
            <MetricCard
              label="Plat n°1"
              value={stats?.topItems?.[0]?.count || 0}
              deltaLabel={stats?.topItems?.[0]?._id?.substring(0, 12) || '—'}
              icon={Award}
            />
          </div>

          {/* Graphique CA + commandes */}
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <p className="text-sm font-medium text-gray-900">Chiffre d'affaires</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatFCFA(chartData.reduce((s, d) => s + d.CA, 0))} sur la période
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
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={period === 'week' ? 32 : 8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="CA" radius={[4, 4, 0, 0]} fill="#111827" opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Commandes + top plats */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            {/* Évolution commandes */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <p className="text-sm font-medium text-gray-900 mb-1">Nombre de commandes</p>
              <p className="text-xs text-gray-400 mb-5">
                {chartData.reduce((s, d) => s + d.cmds, 0)} commandes sur la période
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                  <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="cmds"
                    stroke="#111827"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#111827' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Top plats */}
            <div className="bg-white border border-gray-100 rounded-xl p-5">
              <p className="text-sm font-medium text-gray-900 mb-5">Plats les plus commandés</p>
              {pieData.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">Pas encore de données</p>
              ) : (
                <div className="space-y-3">
                  {pieData.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-300 w-4 flex-shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-900 truncate">{item.name}</span>
                          <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{item.value}×</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.round((item.value / pieData[0].value) * 100)}%`,
                              background: item.color,
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
