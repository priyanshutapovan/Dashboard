import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import {
  CashPage,
  ReceivablesPage,
  OrdersPage,
  DispatchesPage
} from './pages/DetailPages'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cash" element={<CashPage />} />
        <Route path="/receivables" element={<ReceivablesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/dispatches" element={<DispatchesPage />} />
      </Routes>
    </BrowserRouter>
  )
}
