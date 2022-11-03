import React from 'react';
import { MdLocationOn } from "react-icons/md";
import { Select, useToast, Spinner, Skeleton, Stack } from '@chakra-ui/react';
import CheckoutComponent from '../components/CheckoutComponent';
import { useState } from 'react';
import { API_URL } from '../helper';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import axios from 'axios';
import { getUser } from "../slices/userSlice";
import { useSelector } from 'react-redux';
import { getAddress } from '../slices/addressSlice';
import { getCart } from '../slices/cartSlices';
import { useNavigate } from 'react-router-dom';
import ChangeAddressComponent from '../components/ChangeAddressComponent';
import { RiErrorWarningLine } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { userCart } from '../slices/cartSlices';
import Pagination from '../components/Pagination';
import HeadComponent from '../components/HeadComponent';

const CheckoutPage = (props) => {

    const [item, setItem] = useState([]);
    const [deliveryOption, setDeliveryOption] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState('default-0');
    const [address, setAddress] = useState({});
    const [btnSpinner, setBtnSpinner] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [totalData, setTotalData] = useState(0);
    const [totalPurchase, setTotalPurchase] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 4;

    const user = useSelector(getUser);
    const addressList = useSelector(getAddress);
    const cart = useSelector(getCart)
    const toast = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, [currentPage]);

    useEffect(() => {
        getMainAddress();
    }, []);

    let getData = async () => {
        try {
            let token = Cookies.get('sehatToken');

            let resData = await axios.get(API_URL + `/cart/checkouted_item?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage - 1)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (resData.data.succes) {
                setItem(resData.data.items);
                setTotalData(resData.data.count);
                setTotalPurchase(resData.data.purchase);
            };

        } catch (error) {
            console.log(error);
        }
    };

    const getMainAddress = async () => {
        try {
            let token = Cookies.get('sehatToken');

            let resAddress = await axios.get(API_URL + '/user/get_main_address', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (resAddress.data.success) {
                setAddress(resAddress.data.address);
                getDeliveryService(resAddress.data.address.city_id);
                setLoading(false)

            }
        } catch (error) {
            console.log(error);
        }
    };

    let getDeliveryService = async (city_id) => {
        try {
            let token = Cookies.get('sehatToken');

            let resDelivery = await axios.get(API_URL + `/rajaongkir/get_delivery_option/${city_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (resDelivery.data.success) {
                setDeliveryOption(resDelivery.data.option)
            }

        } catch (error) {
            console.log(error);
        }
    };

    const printDeliveryOption = () => {

        let print = deliveryOption.map((val, idx) => {
            return (
                <option key={idx} value={`${val.name} ${val.service}-${val.cost[0].value}`}>{`${val.name} ${val.service} - Rp${val.cost[0].value.toLocaleString('id')} (${val.cost[0].etd} days)`}</option>
            )
        })

        return print
    };

    const printSubTotal = () => {
        let total = 0;

        totalPurchase.forEach(val => {
            total += val.quantity * val.product_price
        })

        return total;
    };

    const printTotalPurchase = () => {
        return printSubTotal() + parseInt(selectedDelivery.split('-')[1]);
    };

    const btnOrder = async () => {
        if (selectedDelivery != 'default-0') {
            let token = Cookies.get('sehatToken');
            let date = new Date()

            let data = {
                user_id: user.user_id,
                transaction_status: 'Awaiting Payment',
                invoice: `INV/${date.getTime()}`,
                total_purchase: printTotalPurchase(),
                delivery_option: selectedDelivery.split('-')[0],
                delivery_charge: parseInt(selectedDelivery.split('-')[1]),
                province: address.province,
                city: address.city,
                city_id: address.city_id,
                district: address.district,
                address_detail: address.address_detail,
                transaction_detail: item,
                receiver: address.receiver
            }

            let resOrder = await axios.post(API_URL + `/transaction/add_transaction`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (resOrder.data.success) {
                let temp = [];

                cart.forEach(val => {
                    if (val.is_selected === 0) {
                        temp.push(val);
                    }
                });

                dispatch(userCart(temp));
                updateStock();
                setDisableBtn(false);
                setBtnSpinner(false);
                navigate('/transaction_list')
                toast({
                    title: `Order success`,
                    description: 'Product will be shipped after payment completed',
                    position: 'top',
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                });
            };

        } else {
            setDisableBtn(false);
            setBtnSpinner(false);
            toast({
                title: `Order can't be proccessed`,
                description: 'Please choose the delivery option first',
                position: 'top',
                status: 'error',
                duration: 3000,
                isClosable: true
            })
        }
    };

    const updateStock = async () => {
        try {
            for (let i = 0; i < item.length; i++) {
                let data = item[i].product_stock - item[i].quantity

                const resUpdate = await axios.patch(API_URL + `/transaction/substract_stock/${item[i].stock_id}`, { data });
            }

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <HeadComponent title={'SEHATBOS | Checkout'} description={'Checkout'} type={'website'}/>
            <div className='bg-white'>
                <div className='min-h-screen py-5 px-5 bg-white'>
                    <div className='lg:flex justify-center container mx-auto mt-[2.5vh]'>
                        <div className='lg:w-3/5 lg:mx-5 container p-3 flex-col'>
                            <div className='border-b'>
                                <div className='flex pb-2 items-center'>
                                    <MdLocationOn className='text-[24px] mr-3 text-hijauBtn' />
                                    <p className='font-bold text-[24px] text-hijauBtn'>My Address</p>
                                </div>
                                {
                                    loading ?
                                        <Stack>
                                            <Skeleton height='20px' width='400px' />
                                            <Skeleton height='20px' width='400px' />
                                            <Skeleton height='20px' width='400px' />
                                        </Stack>
                                        :
                                        addressList.length > 0 ?
                                            address.address_id ?
                                                <div className='py-3'>
                                                    <p className='font-bold text-hijauBtn'>{`${address.receiver} - (+62)${user.phone_number}`}</p>
                                                    <p>{address.address_detail}</p>
                                                    <p>{`${address.district}, ${address.city}, ${address.province}`}</p>
                                                </div>
                                                :
                                                <div className='flex'>
                                                    <RiErrorWarningLine className='mt-1 mr-1 text-red-500' />
                                                    <p className='text-red-500'>You have no main address yet, please choose address manually</p>
                                                </div>
                                            :
                                            <div className='flex items-center pb-7'>
                                                <RiErrorWarningLine className='mt-1 mr-1 text-red-500' />
                                                <p className='text-red-500 text-center'>You dont have any address yet please add your address first</p>
                                            </div>
                                }

                                <ChangeAddressComponent addressList={addressList} getDeliveryService={getDeliveryService} setAddress={setAddress} getMainAddress={getMainAddress} />

                            </div>

                            <div>
                                <p className='font-bold text-[24px] text-hijauBtn py-4'>Order summary</p>
                            </div>

                            {/* Summary */}
                            {
                                item.map((val, idx) => {
                                    return (
                                        <CheckoutComponent key={idx} data={val} />
                                    )
                                })
                            }

                            {
                                totalData > 0 &&
                                <Pagination getProductData={getData} totalData={totalData} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                            }



                        </div>

                        {/* APKG1-29 Checkout Component */}
                        <div className='lg:border lg:rounded lg:w-[350px] lg:h-[450px] px-5'>
                            <p className='hidden lg:block text-poppins text-hijauBtn font-bold pt-5 text-[24px] border-b pb-[16px]'>Payment details</p>

                            <div className='pt-5'>
                                <div className='py-1'>
                                    <p className='text-hijauBtn'>Delivery option</p>
                                    <Select onChange={(e) => setSelectedDelivery(e.target.value)} >
                                        <option value="default-0" selected>Select option</option>
                                        {printDeliveryOption()}
                                    </Select>
                                </div>

                                <div className='py-1 pt-3 flex justify-between'>
                                    <p className='text-hijauBtn'>Delivery charge</p>
                                    <p className='text-hijauBtn font-bold lg:pb-[8px]'>Rp{parseInt(selectedDelivery.split('-')[1]).toLocaleString('id')},-</p>
                                </div>

                                <div className='py-1 flex justify-between'>
                                    <p className='text-hijauBtn'>Sub total</p>
                                    <p className='text-hijauBtn font-bold lg:pb-[8px]'>Rp{printSubTotal().toLocaleString('id')},-</p>
                                </div>

                                <div className='py-1 border-t mt-3'>
                                    <p className='text-hijauBtn'>Total purchase</p>
                                    <p className='text-hijauBtn text-[32px] font-bold'>Rp{printTotalPurchase().toLocaleString('id')},-</p>
                                </div>
                            </div>

                            {
                                addressList.length > 0 ?
                                    <button onClick={() => {
                                        setBtnSpinner(true)
                                        setDisableBtn(true)
                                        setTimeout(btnOrder, 2000)
                                    }} className={`mx-auto  bg-hijauBtn ${disableBtn ? 'hover:bg-brightness-90' : 'hover:bg-white hover:text-hijauBtn'} text-white border w-[290px] lg:w-[312px] h-[42px] lg:h-[40px] font-bold lg:mt-[24px]`}
                                        disabled={disableBtn}
                                    >
                                        {btnSpinner ? <Spinner size='sm' /> : 'Order'}
                                    </button>
                                    :
                                    <button
                                        className={`mx-auto  bg-hijauBtn disabled:cursor-not-allowed text-white border w-[290px] lg:w-[312px] h-[42px] lg:h-[40px] font-bold lg:mt-[24px]`}
                                        disabled
                                    >
                                        Order
                                    </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckoutPage;