import Header from '../components/Header'
import KpiGrid from '../components/KpiGrid'
import AlertBar from '../components/AlertBar'
import RevenueChart from '../components/RevenueChart'
import TopSkus from '../components/TopSkus'
import DispatchList from '../components/DispatchList'
import D2CPanel from '../components/D2CPanel'
import { useDashboardData } from '../hooks/useDashboardData'

export default function Dashboard() {
  const { data } = useDashboardData()

  return (
    <div className="grain min-h-screen">
      <div className="relative z-10 max-w-[1180px] mx-auto px-8 py-6 space-y-5">
        <Header />
        <div className="border-t hairline" />
        <KpiGrid kpis={data.kpis} />
        <AlertBar alerts={data.alerts} />
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-3">
          <RevenueChart data={data.revenue_daily} />
          <TopSkus skus={data.top_skus} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <DispatchList dispatches={data.dispatches} />
          <D2CPanel brands={data.d2c_yesterday} />
        </div>
      </div>
    </div>
  )
}
