import React from "react";
import {
  HiOutlineMenuAlt4,
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineShoppingCart,
} from "react-icons/hi";
import { RiLogoutBoxLine } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import Cookies from 'js-cookie';
import Axios from 'axios';
import { API_URL } from '../helper';
import ButtonComponent from "./ButtonComponent";
import { useNavigate } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuList, Button, IconButton } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import axios from "axios";
import { getUser, userLogOut } from "../slices/userSlice";
import { useSelector } from "react-redux";

export default function NavbarComponent(props) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pathName = window.location.pathname;

  const user = useSelector(getUser);

  const btnLogOut = async () => {
    try {
      let token = Cookies.get('sehatToken');

      let resLogout = await axios.get(API_URL + '/auth/logout', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (resLogout.data.success) {
        Cookies.remove('sehatToken');
        dispatch(userLogOut());
        navigate("/", { replace: true });
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={`border-b border-slate-400 ${props.class} ${pathName === '/' || pathName === '/profile' || pathName === '/product' || pathName === '/cart' || pathName === '/login' || pathName === '/register' ? '' : 'hidden'}`}>
      <div className="bg-transparent flex px-8 py-3 items-center justify-between">
        <div className="md:w-[200px]">
          {/* dropdown menu untuk ukuran hp */}
          <HiOutlineMenuAlt4 className="cursor-pointer hoverIcons md:hidden" />
        </div>
        <div className="flex justify-center">
          <h1 className="text-2xl cursor-pointer font-bold tracking-widest" onClick={() => { navigate('/') }}>SEHATBOS.COM</h1>
        </div>
        <div className="flex items-center space-x-4 justify-end md:w-[200px]">
          {user.user_id ?
            <>
              <Menu>
                <MenuButton as={IconButton} icon={<HiOutlineUser className="cursor-pointer hoverIcons text-black" />} variant='link' px={0} py={0} borderRadius='full'>

                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => { navigate('/profile') }} icon={<CgProfile />}>Profile</MenuItem>
                  <MenuItem icon={<HiOutlineShoppingCart />} onClick={() => navigate('/cart')}>Cart</MenuItem>
                  <MenuItem icon={<RiLogoutBoxLine />} onClick={btnLogOut}>Logout</MenuItem>
                </MenuList>
              </Menu>
              <HiOutlineShoppingBag className="cursor-pointer hoverIcons" onClick={() => navigate('/cart')} />

            </>
            :
            <div className="flex items-center">
              <ButtonComponent text='Sign Up' class='border-borderHijau border-y border-l hover:bg-hijauBtn hover:text-white font-medium' px='4' py='2' brightness='95' onclick={() => navigate('/register')} />
              <ButtonComponent text='Login' class='border-borderHijau border hover:bg-hijauBtn hover:text-white font-medium' px='4' py='2' brightness='95' onclick={() => navigate('/login')} />

            </div>
          }
        </div>
      </div>
      <div className="sm:flex items-center justify-center hidden ">
        <div className="flex justify-evenly space-x-4 my-3">
          <h1 className="text-sm cursor-pointer hover:underline">SHOP ALL</h1>
          <h1 className="text-sm">|</h1>
          <h1 className="text-sm cursor-pointer hover:underline">BEAUTY</h1>
          <h1 className="text-sm">|</h1>
          <h1 className="text-sm cursor-pointer hover:underline">HEALTH & WELLNESS</h1>
          <h1 className="text-sm">|</h1>
          <h1 className="text-sm cursor-pointer hover:underline">PRODUCT LINE</h1>
          <h1 className="text-sm">|</h1>
          <h1 className="text-sm cursor-pointer hover:underline">ABOUT US</h1>
          <h1 className="text-sm">|</h1>
          <h1 className="text-sm cursor-pointer hover:underline">SCIENCE</h1>
        </div>
      </div>
    </div>
  );
}
