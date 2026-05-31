import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import RoomsPage from '../pages/RoomsPage'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes