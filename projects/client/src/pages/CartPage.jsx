import React from 'react';
import CartComponent from '../components/CartComponent';
import { useState } from 'react';
import { API_URL } from '../helper';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react'

const CartPage = (props) => {

    // APKG1-27
    
    const [cartData, setCartData] = useState([]);
    const navigate = useNavigate();
    const toast = useToast();


    const getCartData = async () => {
        try {
            let token = Cookies.get('sehatToken');

            let resCart = await axios.get(API_URL + '/cart/get_cart_data', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });


            if (resCart.data.succes) {
                setCartData(resCart.data.cartData);
                console.log('ini data', resCart.data.cartData);
            }


        } catch (error) {
            console.log(error);
        }
    }


    useState(() => {
        getCartData();
        console.log(cartData);
    }, []);

    const printTotalPurchase = () => {
        let total = 0;

        if (cartData.length > 0) {
            cartData.forEach(val => {
                if (val.is_selected == 1) {
                    total += (val.product_price * val.quantity)
                }
            })

        } else {
            total = 0;
        }

        return total;
    };

    const btnCheckout = () => {
        if (printTotalPurchase() == 0 ) {
            toast({
                title: `Checkout can't be proccessed`,
                description: 'Please choose item first',
                status: 'error',
                isClosable: true,
                position: 'top'
            })
        } else {
            navigate('/checkout')
        }
    }

    return (
        <div className='bg-bgWhite'>
            <div className='h-screen py-5 px-5 bg-white'>
                <div className='lg:flex justify-center container mx-auto mt-[2.5vh]'>
                    <div className='lg:w-3/5 lg:mx-5 container p-3 flex-col'>
                        <div className='border-b'>
                            <p className='font-bold text-[24px] text-hijauBtn pb-6'>My cart</p>
                            {/* <div className='flex py-3'>
                                <div className='flex items-center'>
                                    <input type="checkbox" className='w-[20px] h-[20px] accent-hijauBtn' />
                                </div>
                                <p className='text-[32px font-bold text-poppins] px-4 text-hijauBtn'>Checkout all items</p>
                            </div> */}
                        </div>

                        {
                            cartData.map((val, idx) => {
                                return (
                                    <CartComponent key={idx} data={val} getData={getCartData} cart={cartData}/>

                                )
                            })
                        }

                    </div>

                    {/* Checkout Component */}
                    <div className='lg:border lg:rounded lg:w-[350px] lg:h-[360px] px-5'>
                        <p className='hidden lg:block text-poppins text-hijauBtn font-bold pt-3 text-[24px] border-b pb-6'>Order summary</p>

                        <div className='pt-5'>
                            <p className='text-hijauBtn'>Total purchase :</p>
                            <p className='text-hijauBtn font-bold text-[32px] lg:border-b lg:pb-[40px]'>RP{printTotalPurchase().toLocaleString('id')},-</p>
                        </div>

                        <button onClick={btnCheckout} className='mx-auto  bg-hijauBtn hover:bg-white text-white hover:text-hijauBtn border w-[290px] lg:w-[312px] h-[42px] lg:h-[40px] font-bold lg:mt-[42px]'>
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage