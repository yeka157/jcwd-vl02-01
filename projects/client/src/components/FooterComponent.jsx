import { Input } from '@chakra-ui/react'
import React from 'react'
import ButtonComponent from './ButtonComponent';
import { SiFacebook, SiInstagram, SiLinkedin, SiTwitter } from 'react-icons/si';

export default function FooterComponent() {
  return (
    <div className='bg-bgWhite'>
      <div className='flex justify-around flex-col md:flex-row py-10'>
        <div className='space-y-2'>
          <h1 className='font-bold'>SEHATBOS.COM</h1>
          <p className='text-sm'>Dago No. 132, Bandung</p>
          <p className='text-sm'>Open Hours (offline store)</p>
          <p className='text-sm'>Mon-Sat, 7am - 9pm,</p>
          <p className='text-sm'>Closed Sundays</p>
        </div>
        <div className='space-y-2'>
          <h1 className='font-bold'>Contacts</h1>
          <p className='text-sm'>support@sehatbos.com</p>
          <p className='text-sm'>+6281256233</p>
          <div className='flex space-x-2 py-4'>
            <SiInstagram className='w-5 h-auto' color='#E1306C'/>
            <SiFacebook className='w-5 h-auto' color='#4267B2'/>
            <SiTwitter className='w-5 h-auto' color='#1DA1F2'/>
            <SiLinkedin className='w-5 h-auto' color='#0077b5'/>
          </div>
        </div>
        <div className='md:max-w-[25%] space-y-2'>
          <h1 className='font-bold'>Subscribe</h1>
          <p className='text-sm'>Subscribe to our newsletter and get updated 
            when there is a new product in our store</p>
          <Input placeholder='Email'/>
          <ButtonComponent text='Subscribe' brightness='90' py='4' px='8' class='bg-hijauBtn text-white w-full font-medium'/>
        </div>
      </div>
    </div>
  )
}
