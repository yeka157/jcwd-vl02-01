import React from 'react'
import FooterComponent from '../components/FooterComponent'
import LandingComponent from '../components/LandingComponent'
import MenuComponent from '../components/MenuComponent'
import NavbarComponent from '../components/NavbarComponent'
import HeadComponent from '../components/HeadComponent'

export default function LandingPage() {
  return (
    <div>
        <HeadComponent title={'SEHATBOS.COM'} description={'Landing page of SEHATBOS.COM'} type={'website'}/>
        <div className='bg-bgWhite'>
            {/* <NavbarComponent/> */}
            <LandingComponent/>
        </div>
        <MenuComponent/>
        <FooterComponent/>
    </div>
  )
}
