import React from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";


const CartComponent = () => {

    return (
        <div className='lg:flex border-b py-4'>
            <div className='my-5 flex lg:w-2/3'>

                <div className='flex items-center'>
                    <input type="checkbox" className='w-[20px] h-[20px] accent-hijauBtn' />
                </div>

                <div className='lg:w-[180px] w-[75px] mx-4 lg:mx-[32px]'>
                    <img src="https://d2qjkwm11akmwu.cloudfront.net/products/2bd0e3dd-246e-4220-8629-75ac7082bb97_product_image_url.webp" alt="" />
                </div>

                <div className='flex items-center w-[300px] lg:w-[220px]'>
                    <div>
                        <p className='text-hijauBtn'>Paracetamol lalalala</p>
                        <p className='font-bold text-hijauBtn'>RP. 50.000,-</p>
                    </div>
                </div>
            </div>


            <div className='flex items-center lg:w-full'>
                <div className='ml-[150px] lg:ml-[12px] lg:h-[180px] lg:w-[350px] flex lg:flex-row-reverse pb-5'>

                    <div className='flex items-center mx-5'>
                        <div>
                            <RiDeleteBin6Line className='text-[24px] cursor-pointer hover:text-red-500' />
                        </div>
                    </div>

                    <div className='hidden lg:flex items-center w-[200px] lg:w-[220px] mx-[32px]'>
                        <div>
                            <p className='font-bold text-hijauBtn'>RP. 100.000,-</p>
                        </div>
                    </div>

                    <div className='flex items-center lg:mr-[32px]'>
                        <button className='border px-2 hover:text-white hover:bg-hijauBtn'>-</button>
                        <span className='px-2 border'>2</span>
                        <button className='border px-1 hover:text-white hover:bg-hijauBtn'>+</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartComponent;