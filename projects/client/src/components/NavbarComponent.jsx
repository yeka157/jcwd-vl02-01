import React from "react";
import {
  HiOutlineMenuAlt4,
  HiOutlineUser,
  HiOutlineShoppingBag,
} from "react-icons/hi";
import Cookies from 'js-cookie';
import Axios from 'axios';
import API_URL from '../helper';
import ButtonComponent from "./ButtonComponent";

export default function Navbar() {

  const [data, setData] = React.useState([]);


  React.useEffect(() => {
    let token = Cookies.get('sehatToken');
    if (token) {
      Axios.get(API_URL + '/auth/keep_login', {
        headers : {
          Authorization : `Bearer ${token}`
        },
      })
      .then((res) => {
        setData(res.data.dataUser);
      })
    }
  })
  return (
    <div className="border-b border-slate-400">
      <div className="bg-transparent flex px-8 py-3 items-center justify-between">
        <div className="md:w-[200px]">
            {/* dropdown menu untuk ukuran hp */}
            <HiOutlineMenuAlt4 className="cursor-pointer hoverIcons"/>
        </div>
        <div className="flex justify-center">
          <h1 className="text-2xl cursor-pointer font-bold">SEHATBOS.COM</h1>
        </div>
        <div className="flex items-center space-x-4 justify-end md:w-[200px]">
          {data.iduser ? 
          <>
          <HiOutlineUser  className="cursor-pointer hoverIcons"/>
          <HiOutlineShoppingBag  className="cursor-pointer hoverIcons"/>
          </>
          :
        <div className="flex items-center">
          <ButtonComponent text='Sign Up' class='border-borderHijau border-y border-l hover:bg-hijauBtn hover:text-white font-medium' px='4' py='1.5' brightness='95'/>
          <ButtonComponent text='Login' class='border-borderHijau border hover:bg-hijauBtn hover:text-white font-medium' px='4' py='1.5' brightness='95'/>
        </div>
        }
        </div>
      </div>
      <div className="sm:flex items-center justify-center hidden ">
        <div className="flex justify-evenly space-x-4 py-3">
          <h1 className="text-sm cursor-pointer">SHOP ALL</h1>
          <h1 className="text-sm cursor-pointer">BEAUTY</h1>
          <h1 className="text-sm cursor-pointer">HEALTH & WELLNESS</h1>
          <h1 className="text-sm cursor-pointer">PRODUCT LINE</h1>
          <h1 className="text-sm cursor-pointer">ABOUT US</h1>
          <h1 className="text-sm cursor-pointer">SCIENCE</h1>
        </div>
      </div>
    </div>
  );
}
