import React from "react";
import {
  HiOutlineMenuAlt4,
  HiOutlineUser,
  HiOutlineShoppingBag,
} from "react-icons/hi";
import { GoChecklist } from "react-icons/go";
import { RiLogoutBoxLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import Cookies from "js-cookie";
import Axios from "axios";
import { API_URL } from "../helper";
import ButtonComponent from "./ButtonComponent";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getUser, userLogOut } from "../slices/userSlice";

export default function Navbar(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pathName = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const user = useSelector(getUser);

  const btnLogout = () => {
    dispatch(userLogOut());
    Cookies.remove("sehatToken");
    if (pathName !== "/") {
      navigate("/", { replace: true });
    }
  };

  React.useEffect(() => {
    // console.log(pathName);
    // console.log(params.get('category'));
  })

  return (
    <div className={`border-b border-slate-400 ${props.class} ${
      pathName === '/' || 
      pathName === '/transaction_list'|| 
      pathName === '/prescription' || 
      pathName === '/profile' || 
      pathName === '/cart'  || 
      pathName === '/checkout'|| 
      pathName === '/login' || 
      pathName === '/register' || 
      pathName === '/product' || 
      pathName === '/product/detail' ||
      pathName === '/transaction_detail'
      ? '' : 'hidden'} 
      ${pathName === '/login' || pathName === '/register' || pathName === '/transaction_detail' ? 'absolute w-full' : ""}`}>
      <div className="bg-transparent flex px-8 py-3 items-center justify-between">
        <div className="md:w-[200px]">
          {/* dropdown menu untuk ukuran hp */}
          <HiOutlineMenuAlt4 className="cursor-pointer hoverIcons md:hidden" />
        </div>
        <div className="flex justify-center">
          <h1
            className="text-2xl cursor-pointer font-bold tracking-widest"
            onClick={() => {
              navigate("/");
            }}
          >
            SEHATBOS.COM
          </h1>
        </div>
        <div className="flex items-center space-x-4 justify-end md:w-[200px]">
          {user.user_id ? (
            user.role === "CUSTOMER" ? 
            <>
            <Menu>
              <MenuButton as={IconButton} icon={<HiOutlineUser className="cursor-pointer hoverIcons text-black" />} variant='link' px={0} py={0} borderRadius='full'>
                
              </MenuButton>
              <MenuList>
                <MenuItem onClick={()=> {navigate('/profile')}} icon={<CgProfile/>}>Profile</MenuItem>
                <MenuItem onClick={()=> {navigate('/transaction_list')}} icon={<GoChecklist/>}>Transaction List</MenuItem>
                <MenuItem icon={<RiLogoutBoxLine/>} onClick={btnLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
              <HiOutlineShoppingBag onClick={()=> {navigate('/cart')}} className="cursor-pointer hoverIcons text-black" />
            </>
            :
            <>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={
                    <HiOutlineUser className="cursor-pointer hoverIcons text-black" />
                  }
                  variant="link"
                  px={0}
                  py={0}
                  borderRadius="full"
                ></MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      navigate("/admin");
                    }}
                    icon={<CgProfile />}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem icon={<RiLogoutBoxLine />} onClick={btnLogout}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
              <HiOutlineShoppingBag
                onClick={() => {
                  navigate("/cart");
                }}
                className="cursor-pointer hoverIcons text-black hidden"
              />
            </>
          ) : (
            <div className="flex items-center">
              <ButtonComponent
                text="Sign Up"
                class="border-borderHijau border-y border-l hover:bg-hijauBtn hover:text-white font-medium"
                px="4"
                py="2"
                brightness="95"
                onclick={() => navigate("/register")}
              />
              <ButtonComponent
                text="Login"
                class="border-borderHijau border hover:bg-hijauBtn hover:text-white font-medium"
                px="4"
                py="2"
                brightness="95"
                onclick={() => navigate("/login")}
              />
            </div>
          )}
        </div>
      </div>
      <div className="md:flex items-center justify-center hidden ">
        <div className="flex justify-evenly space-x-4 my-3">
          <h1
            className={`hover:underline ${
              pathName === "/"
                ? "font-medium text-base underline leading-[5px] cursor-default disabled"
                : "text-sm hover:leading-3 cursor-pointer"
            }`}
            onClick={() => navigate("/")}
          >
            HOME
          </h1>
          <h1 className="text-sm">|</h1>
          <h1 className={`hover:underline ${
            params.get('category') === 'antivirus' ? 
            'font-medium text-base underline leading-[5px] cursor-default disabled' 
            : 
            'text-sm hover:leading-3 cursor-pointer'
          }`} onClick={() => navigate('/product?category=antivirus', {
            state : {
              category : 'Anti Virus'
            }
          })}>
            ANTI VIRUS
          </h1>
          <h1 className="text-sm">|</h1>
          <h1 className={`hover:underline ${
            params.get('category') === 'healthNwellness' ? 
            'font-medium text-base underline leading-[5px] cursor-default disabled' 
            : 
            'text-sm hover:leading-3 cursor-pointer'
          }`} onClick={() => navigate('/product?category=healthNwellness', {
            state : {
              category : 'Suplement'
            }
          })}>
            HEALTH & WELLNESS
          </h1>
          <h1 className="text-sm">|</h1>
          <h1
            className={`hover:underline ${
              pathName === "/product" || pathName === "/product/detail"
                ? 
                params.get('category') === "antivirus" || params.get('category') === 'healthNwellness' ? 'text-sm hover:leading-3 cursor-pointer' : 
                "font-medium text-base underline leading-[5px] cursor-default disabled"
                : "text-sm hover:leading-3 cursor-pointer"
            }`}
            onClick={() => navigate("/product", { state : { category : ''}})}
          >
            PRODUCT LINE
          </h1>
          <h1 className="text-sm">|</h1>
          <h1 className="text-sm cursor-pointer hover:underline hover:leading-3">
            ABOUT US
          </h1>
          <h1 className="text-sm">|</h1>
          <h1 className="text-sm cursor-pointer hover:underline hover:leading-3">
            SCIENCE
          </h1>
        </div>
      </div>
    </div>
  );
}
