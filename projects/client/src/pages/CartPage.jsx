import React, { useEffect } from 'react';
import CartComponent from '../components/CartComponent';
import { useState } from 'react';
import { API_URL } from '../helper';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast, Spinner } from '@chakra-ui/react';
import { FaCartPlus } from "react-icons/fa";
import { userCart } from '../slices/cartSlices';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../components/Pagination';

const CartPage = (props) => {

    // APKG1-27

    const [cartData, setCartData] = useState([]);
    const [totalPurchase, setTotalPurchase] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalData, setTotalData] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();

    const itemsPerPage = 4;

    const getCartData = async () => {
        try {
            let token = Cookies.get('sehatToken');

            let resCart = await axios.get(API_URL + `/cart/get_cart_data?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage - 1)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (resCart.data.succes) {
                setCartData(resCart.data.cartData);
                setTotalData(resCart.data.count);
                setTotalPurchase(resCart.data.purchase);
                dispatch(userCart(resCart.data.cartData))
                setLoading(false)
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCartData();
    }, [currentPage]);

    const printTotalPurchase = () => {
        let total = 0;

        if (totalPurchase.length > 0) {
            totalPurchase.forEach(val => {
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
        if (printTotalPurchase() == 0) {
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
        <div>
            <div className='min-h-screen py-5 px-5 bg-white'>
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
                            !loading ?
                                cartData.length > 0 ?
                                    <div>
                                        {
                                            cartData.map((val, idx) => {
                                                return (
                                                    <CartComponent key={idx} data={val} getData={getCartData} cart={cartData} />
                                                )
                                            })
                                        }
                                    </div>
                                    :
                                    <div className='flex justify-center pt-[200px]'>
                                        <div className='mx-auto'>
                                            <FaCartPlus className='mx-auto text-[120px] text-center text-muted' />
                                            <p className='mx-auto pt-4 text-center text-muted'>Your cart is empty, let add some products</p>
                                        </div>
                                    </div>
                                :
                                <div className='flex justify-center pt-[200px]'>
                                    <div className='mx-auto'>
                                        <Spinner size='md' className='mx-auto' color={'teal'} />
                                    </div>
                                </div>
                        }

                        <div className='mt-[120px]'>
                            <Pagination getProductData={getCartData} totalData={totalData} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        </div>

                    </div>

                    {/* Checkout Component */}
                    <div className='lg:border lg:rounded lg:w-[350px] lg:h-[360px] px-5'>
                        <p className='hidden lg:block text-poppins text-hijauBtn font-bold pt-3 text-[24px] border-b pb-6'>Order summary</p>

                        <div className='pt-5'>
                            <p className='text-hijauBtn'>Total purchase :</p>
                            <p className='text-hijauBtn font-bold text-[32px] lg:border-b lg:pb-[40px]'>Rp{printTotalPurchase().toLocaleString('id')},-</p>
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