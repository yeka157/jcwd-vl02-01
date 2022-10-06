import axios from 'axios';
import react, { useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom"
import { API_URL, COOKIE_EXP } from './helper';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerificationPage from './pages/VerificationPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminCategoryPage from './pages/AdminCategoryPage';
import Cookies from 'js-cookie';
import { userLogin, getUser } from './slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import ProfilePage from './pages/ProfilePage';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePasswordPages';
import NotFoundPage from './pages/NotFoundPage';
import NavbarComponent from './components/NavbarComponent';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PrescriptionPage from './pages/PrescriptionPage';

function App() {

  const dispatch = useDispatch();
  const user = useSelector(getUser);

  useEffect(() => {
    KeepLogin();
  }, [])

  const KeepLogin = async () => {
    try {

      let token = Cookies.get('sehatToken');

      if (token) {
        let resUser = await axios.get(API_URL + '/auth/keep_login', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (resUser.data.success) {
          Cookies.set('sehatToken', resUser.data.token, { expires: COOKIE_EXP });
          delete resUser.data.token
          dispatch(userLogin(resUser.data.dataUser));
          console.log('data login');
        }
      }

    } catch (error) {
      console.log(error);
    }

  };


  return (
    <div>
      <NavbarComponent class='bg-bgWhite' function={KeepLogin} />
      <Routes>
        {/* Kevin - APKG1-2 - Landing Page */}
        <Route path='/' element={<LandingPage />} />
        {/* Vikri APKG1- 3 s/d APKG1-13 */}
        <Route path='/verification/:token' element={<VerificationPage />} />
        <Route path='/reset_password/:token' element={<ResetPassword />} />
        <Route path='/change_password/:token' element={<ChangePassword />} />


        {
          user.user_id ?
            user.role == 'CUSTOMER' ?
              <>
                {/* Kevin - APKG1-13 - Profile Page */}
                <Route path='/profile' element={<ProfilePage />} />
                <Route path='/cart' element={<CartPage />} />
                <Route path='/checkout' element={<CheckoutPage />} />
                <Route path='/prescription' element={<PrescriptionPage />} />
              </>
              :
              <>
                <Route path='/*' element={<NotFoundPage />} />
              </>
            :
            <>
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/login' element={<LoginPage />} />
            </>
        }

        {
          user.role != 'CUSTOMER' ?
            <>
              {/* Luky - EPIC PRODUCT & INVENTORY - APKG1-20 to APKG1-24 */}
              {/* ADMIN ONLY | REDIRECT USER TO NOT FOUND PAGE */}
              <Route path='/admin' element={<AdminDashboardPage />} />
              <Route path='/admin/category' element={<AdminCategoryPage />} />
            </>
            :
            <Route path='/*' element={<NotFoundPage />} />
        }
      </Routes>
    </div>
  );
}

export default App;
