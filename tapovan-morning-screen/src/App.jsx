import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import {
  CashPage,
  ReceivablesPage,
  OrdersPage,
  DispatchesPage,
  CarrierTrackerPage
} from './pages/DetailPages'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/carrier-tracker" element={<CarrierTrackerPage />} />
          <Route path="/cash" element={<CashPage />} />
          <Route path="/receivables" element={<ReceivablesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/dispatches" element={<DispatchesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
