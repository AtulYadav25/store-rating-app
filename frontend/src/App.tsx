import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast';
import Profile from './pages/Profile'
import UpdatePassword from './pages/UpdatePassword'
import StoreDetails from './pages/StoreDetails'
import { ROLES } from './constants/ROLES'
import AdminDashboard from './pages/adminPages/AdminDashboard'
import AllUsers from './pages/adminPages/AllUsers'
import AddUser from './pages/adminPages/AddUser'
import AddStore from './pages/adminPages/AddStore'

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/store/:storeId" element={<StoreDetails />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/users" element={<AllUsers />} />
            <Route path="/dashboard/admin/add-user" element={<AddUser />} />
            <Route path="/dashboard/admin/add-store" element={<AddStore />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={[ROLES.STORE_OWNER]} />}>
            <Route path="/dashboard/owner" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App


