import React from 'react'
import NavbarComponent from '../components/NavbarComponent';
import Cookies from 'js-cookie';
import ProfileComponent from '../components/ProfileComponent';
import Axios from 'axios';
import { getUser } from '../slices/userSlice';
import { useSelector } from 'react-redux';

export default function ProfilePage() {
    React.useEffect(() => {
        let token = Cookies.get('sehatToken');
        if (token) {
            
        }
    });    
    const user = useSelector(getUser);

  return (
    <div>
        <NavbarComponent/>
        <div className='flex max-w-7xl mx-auto border-black border-x min-h-screen'>
          <ProfileComponent />
        </div>
    </div>
  )
}
