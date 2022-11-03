import React from "react";
import ProfileComponent from "../components/ProfileComponent";
import { getUser } from "../slices/userSlice";
import { useSelector } from "react-redux";
import HeadComponent from "../components/HeadComponent";

export default function ProfilePage() {
  const user = useSelector(getUser);
  return (
    <>
      <HeadComponent title={'SEHATBOS | Profile'} description={'Profile'} type={'website'}/>
      <div className="bg-bgWhite">
        {/* <NavbarComponent /> */}
        <div className="flex max-w-[1400px] mx-auto border-borderHijau border-x min-h-screen">
          <ProfileComponent
            iduser={user.user_id}
            name={user.name}
            username={user.username}
            email={user.email}
            birth={user.birthdate}
            gender={user.gender}
            phone={user.phone_number}
            status={user.status}
            picture={user.profile_picture}
          />
        </div>
      </div>
    </>
  );
}
