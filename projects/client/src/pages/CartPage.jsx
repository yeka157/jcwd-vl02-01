import React from 'react';
import Navbar from '../components/NavbarComponent'
import CartComponent from '../components/testCartComponent';



const CartPage = (props) => {

    return (
        <div className='bg-bgWhite'>
            <div className='h-screen py-5 px-5 bg-white'>
                <div className='lg:flex justify-center container mx-auto mt-[2.5vh]'>
                    <div className='lg:w-3/5 lg:mx-5 container p-3 flex-col'>
                        <div className='border-b'>
                            <p className='font-bold text-[24px] text-hijauBtn'>My cart</p>
                            <div className='flex py-3'>
                                <div className='flex items-center'>
                                    <input type="checkbox" className='w-[20px] h-[20px] accent-hijauBtn'  />
                                </div>
                                <p className='text-[32px font-bold text-poppins] px-4 text-hijauBtn'>Checkout all items</p>
                            </div>
                        </div>

                        {/* Cart Component */}
                        <CartComponent/>

                    </div>

                    {/* Checkout Component */}
                    <div className='lg:border lg:rounded lg:w-[350px] lg:h-[360px] px-5'>
                        <p className='hidden lg:block text-poppins text-hijauBtn font-bold pt-5 text-[24px] border-b pb-[40px]'>Order summary</p>

                        <div className='pt-5'>
                            <p className='text-hijauBtn'>Total purchase (2 items)</p>
                            <p className='text-hijauBtn font-bold text-[32px] lg:border-b lg:pb-[40px]'>RP. 100.000,-</p>
                        </div>

                        <button className='mx-auto  bg-hijauBtn hover:bg-white text-white hover:text-hijauBtn border w-[290px] lg:w-[312px] h-[42px] lg:h-[40px] font-bold lg:mt-[42px]'>
                            Checkout
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage