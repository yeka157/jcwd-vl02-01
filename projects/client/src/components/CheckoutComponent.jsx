import React from 'react';

const CheckoutComponent = (props) => {

    return (
        <div className='lg:flex border-b'>
            <div className='my-5 flex lg:w-2/3'>
                <div className='lg:w-[180px] w-[75px] mx-4 lg:mx-[32px]'>
                    <img src={props.data.product_image.includes('http') ? props.data.product_image : `http://localhost:8000/${props.data.product_image}`}alt="" />
                </div>

                <div className='flex items-center w-[300px] lg:w-[220px]'>
                    <div>
                        <p className='text-hijauBtn'>{props.data.product_name}</p>
                        <p className='font-bold text-hijauBtn'>RP{props.data.product_price.toLocaleString('id')},-</p>
                    </div>
                </div>
            </div>


            <div className='flex items-center lg:w-full'>
                <div className='ml-[150px] lg:ml-[12px] lg:h-[180px] lg:w-[350px] flex lg:flex-row-reverse pb-5'>

                    <div className='hidden lg:flex items-center w-[200px] lg:w-[220px] mx-[32px]'>
                        <div>
                            <p className='font-bold text-hijauBtn'>RP{(props.data.product_price * props.data.quantity).toLocaleString('id')},-</p>
                        </div>
                    </div>

                    <div className='flex items-center lg:mr-[32px]'>
                        <span className='px-2'>{props.data.quantity}x</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutComponent;