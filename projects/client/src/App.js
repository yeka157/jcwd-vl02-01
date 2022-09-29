import axios from 'axios';
import react, { useEffect } from 'react';
import { Route, Routes } from "react-router-dom"
import { API_URL, COOKIE_EXP } from './helper';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerificationPage from './pages/VerificationPage';
import Cookies from 'js-cookie';
import { userLogin } from './slices/userSlice';
import { useDispatch } from 'react-redux';
import ResetPassword from './pages/ResetPassword';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    KeepLogin();

  }, [])

  const KeepLogin = async () => {
    try {

      let token = Cookies.get('sehatToken');
      console.log('ini token dari login',token);

      let resUser = await axios.get(API_URL + '/auth/keep_login', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (resUser.data.success) {
        Cookies.set('sehatToken', resUser.data.token, { expires: COOKIE_EXP });
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
        <Route path='/reset_password/:token' element={<ResetPassword/>}/>
      </Routes>
    </div>
  );
}

export default App;
