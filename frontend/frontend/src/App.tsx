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
            <Route path="flight" element={<LastFlight />} />
            <Route path="purchase" element={<Purchase />} />
            <Route path="mycart" element={<MyCart />} />
            <Route path="news" element={<News />} />
          </Route>
          <Route path="support" element={<Support />} />
          <Route path="explore" element={<Explore />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
