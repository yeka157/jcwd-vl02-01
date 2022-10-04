import React from 'react'
import LandingComponent from '../components/LandingComponent'
import MenuComponent from '../components/MenuComponent'
import NavbarComponent from '../components/NavbarComponent'

export default function LandingPage() {
  return (
    <div>
        <div className='bg-bgWhite'>
            {/* <NavbarComponent/> */}
            <LandingComponent/>
        </div>
        <MenuComponent/>
    </div>
  )
}
