import axios from 'axios';
import react, { useEffect } from 'react';
import { Route, Routes } from "react-router-dom"
import { API_URL } from './helper';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerificationPage from './pages/VerificationPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminCategoryPage from './pages/AdminCategoryPage';
import Cookies from 'js-cookie';
import { userLogin } from './slices/userSlice';
import { useDispatch } from 'react-redux';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    KeepLogin();

  }, [])

  const KeepLogin = async () => {
    try {

      let token = Cookies.get('sehatToken');
      console.log(token);

      let resUser = await axios.get(API_URL + '/auth/keep_login', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (resUser.data.success) {
        Cookies.set('sehatToken', resUser.data.token, { expires: 2 });
        delete resUser.data.token
        dispatch(userLogin(resUser.data.dataUser));
        console.log('Keep login success');
      }

    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div>
      <Routes>
        {/* Kevin - APKG1-2 - Landing Page */}
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/verification/:token' element={<VerificationPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />

        {/* Luky - EPIC PRODUCT & INVENTORY - APKG1-20 to APKG1-24 */}
        {/* ADMIN ONLY | REDIRECT USER TO NOT FOUND PAGE */}
        <Route path='/admin' element={<AdminDashboardPage />} />
        <Route path='/admin/category' element={<AdminCategoryPage />} />
      </Routes>
    </div>
  );
}

export default App;
