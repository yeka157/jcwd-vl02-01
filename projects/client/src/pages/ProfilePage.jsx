import React from 'react'
import NavbarComponent from '../components/NavbarComponent';
import ProfileComponent from '../components/ProfileComponent';
import { getUser } from '../slices/userSlice';
import { useSelector } from 'react-redux';

export default function ProfilePage() {   
    const user = useSelector(getUser);
  return (
    <div>
        <NavbarComponent/>
        <div className='flex max-w-7xl mx-auto border-black border-x min-h-screen'>
          <ProfileComponent iduser={user.user_id}name={user.name} username={user.username} email={user.email} birth={user.birthdate} gender={user.gender} phone={user.phone_number} status={user.status}/>
        </div>
    </div>
  )
}
