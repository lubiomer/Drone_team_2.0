import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import { getHomeRouteForLoggedInUser, getUserData } from './utils/Utils';
import RequireUser from './components/RequireUser';
import Dashboard from './pages/user/Dashboard';
import Support from './pages/user/Support';
import Explore from './pages/Explore';
import News from './pages/News';
import MyCart from './pages/user/MyCart';
import Shop from './pages/user/Shop';
import Purchase from './pages/user/Purchase';
import LastFlight from './pages/user/LastFlight';
import ShopItems from './pages/user/ShopItems';
import Profile from './pages/user/Profile';
import AdminLogin from './pages/auth/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import AdminShop from './pages/admin/AdminShop';
import AdminProductCreate from './pages/admin/AdminProductCreate';

const App = () => {
  const getHomeRoute = () => {
    const user = getUserData()
    if (user) {
      return getHomeRouteForLoggedInUser(user.role)
    } else {
      return <Home />
    }
  }
  return (
    <Suspense fallback={null}>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={getHomeRoute()} />

          <Route element={<RequireUser allowedRoles={['user']} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="shop" element={<Shop />} />
            <Route path="shop/items" element={<ShopItems />} />
            <Route path="flight" element={<LastFlight />} />
            <Route path="purchase" element={<Purchase />} />
            <Route path="mycart" element={<MyCart />} />
            <Route path="news" element={<News />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route element={<RequireUser allowedRoles={['admin']} />}>
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/users" element={<Users />} />
            <Route path="admin/shop" element={<AdminShop />} />
            <Route path="admin/shop/create-product" element={<AdminProductCreate />} />
          </Route>
          <Route path="support" element={<Support />} />
          <Route path="explore" element={<Explore />} />
          <Route path="login" element={<Login />} />
          <Route path="admin/login" element={<AdminLogin />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
