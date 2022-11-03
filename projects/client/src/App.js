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
import AdminProductPage from './pages/AdminProductPage';
import AdminTransactionPage from './pages/AdminTransactionPage';
import Cookies from 'js-cookie';
import { userLogin, getUser } from './slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import ProfilePage from './pages/ProfilePage';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePasswordPages';
import NotFoundPage from './pages/NotFoundPage';
import NavbarComponent from './components/NavbarComponent';
import { userAddress } from './slices/addressSlice';
import { userCart } from "./slices/cartSlices";
import ProductListPage from './pages/ProductListPage';
import PrescriptionPage from './pages/PrescriptionPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AdminReportPage from './pages/AdminReportPage';
import AdminSalesReportPage from './pages/AdminSalesReportPage';
import AdminStockHistoryPage from './pages/AdminStockHistoryPage';
import TransactionListPage from './pages/TransactionListPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import AdminReportTransaction from './pages/AdminReportTransaction';
import AdminReportUser from './pages/AdminReportUser';
import AdminReportProduct from './pages/AdminReportProduct';

function App() {
  const [userData, setUserData] = useState([]);
  const pathName = window.location.pathname;

  const dispatch = useDispatch();
  const user = useSelector(getUser);
  let token = Cookies.get('sehatToken');

  useEffect(() => {
    KeepLogin();
    KeepAddress();
  }, [])

  const KeepLogin = async () => {
    try {
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
          dispatch(userCart(resUser.data.cart))
          setUserData(resUser.data.dataUser);
        }
      }

    } catch (error) {
      console.log(error);
    }
  };

  const KeepAddress = async () => {
    try {
      let token = Cookies.get('sehatToken');
      if (token) {
        let response = await axios.get(API_URL + '/user/get_address', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.data) {
          dispatch(userAddress(response.data));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <NavbarComponent class={'bg-bgWhite'} />
      <Routes>
        {/* Kevin - APKG1-2 - Landing Page */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/product' element={<ProductListPage />} />
        <Route path='/product/detail' element={<ProductDetailsPage />} />
        {/* Vikri APKG1- 3 s/d APKG1-13 */}
        <Route path='/verification/:token' element={<VerificationPage />} />
        <Route path='/reset_password/:token' element={<ResetPassword />} />
        <Route path='/change_password/:token' element={<ChangePassword />} />


        {
          user.user_id ?
          user.role === 'CUSTOMER' ?
          <>
            {/* Kevin - APKG1-13 - Profile Page */}
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/prescription' element={<PrescriptionPage />} />
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='/transaction_list' element={<TransactionListPage />} />
            <Route path='/transaction_detail' element={<TransactionDetailPage />} />
            <Route path='/*' element={<NotFoundPage />} />
          </>
          :
          <>
            {/* Luky - EPIC PRODUCT & INVENTORY - APKG1-20 to APKG1-24 */}
            {/* ADMIN ONLY | REDIRECT USER TO NOT FOUND PAGE */}
            <Route path='/admin' element={<AdminDashboardPage />} />
            <Route path='/admin/category' element={<AdminCategoryPage />} />
            <Route path="/admin/product" element={<AdminProductPage />} />
            <Route path='/admin/report' element={<AdminReportPage/>} />
            <Route path='/admin/report/sales' element={<AdminSalesReportPage/>} />
            <Route path='/admin/report/sales/product' element={<AdminReportProduct/>} />
            <Route path='/admin/report/sales/transaction' element={<AdminReportTransaction/>} />
            <Route path='/admin/report/sales/user' element={<AdminReportUser/>} />
            <Route path='/admin/report/stock' element={<AdminStockHistoryPage/>} />
            <Route path="/admin/transaction" element={<AdminTransactionPage />} />
          </> 
          :
          <>
            <Route path='/*' element={<NotFoundPage />} /> 
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/login' element={<LoginPage />} />
          </>
        }
      </Routes>
    </div>
  );
}

export default App;
