import React, { useEffect } from 'react';
import { MdLocationOn } from "react-icons/md";
import { getUser } from "../slices/userSlice";
import { useSelector } from 'react-redux'
import { useState } from 'react';
import { Select, Spinner, useToast, Skeleton, Stack } from '@chakra-ui/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../helper';
import { HiXCircle } from "react-icons/hi";
import { AiOutlineUpload } from "react-icons/ai";
import { getAddress } from '../slices/addressSlice';
import ChangeAddressComponent from '../components/ChangeAddressComponent';
import { useNavigate } from 'react-router-dom';
import { RiErrorWarningLine } from "react-icons/ri";

const PrescriptionPage = (props) => {

    const [prescriptionImage, setPrescription] = useState('');
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [deliveryOption, setDeliveryOption] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState('default-0');
    const [address, setAddress] = useState({});
    const [btnThrottle, setBtnThrottle] = useState(false);
    const [loading, setLoading] = useState(true);

    const user = useSelector(getUser);
    const navigate = useNavigate();
    const addressList = useSelector(getAddress);
    const toast = useToast();


    const getMainAddress = async () => {
        try {
            let token = Cookies.get('sehatToken');

            if (token) {
                let resAddress = await axios.get(API_URL + '/user/get_main_address', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (resAddress.data.success) {
                    setAddress(resAddress.data.address);
                    getDeliveryService(resAddress.data.address.city_id);
                    setLoading(false);
                    return;
                };

            }

            setLoading(false);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getMainAddress();
    }, []);


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

    const addImage = (e) => {
        if (e.target.files[0].type === 'image/png' || e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "image/jpg" || e.target.files[0].type === 'image/gif') {
            if (e.target.files[0].size > 1048576) {
                toast({
                    title: 'File uploaded is too big',
                    description: 'Max size is 1 MB',
                    position: 'top',
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                })
            } else {
                setPrescription(e.target.files[0]);
                const reader = new FileReader();
                if (e.target.files[0]) {
                    reader.readAsDataURL(e.target.files[0])
                }

                reader.onload = (readEvent) => {
                    setSelectedImage(readEvent.target.result)
                }
            }
        } else {
            toast({
                title: 'Wrong file format',
                description: 'Your file format is not supported',
                position: 'top',
                status: 'error',
                duration: 3000,
                isClosable: true
            })
        }
    };

    const btnOrder = async () => {
        try {
            let date = new Date();
            let formData = new FormData();
            let token = Cookies.get('sehatToken');

            formData.append('image', prescriptionImage);

            formData.append('data', JSON.stringify({
                user_id: user.user_id,
                transaction_status: 'Awaiting Admin Confirmation',
                invoice: `INV/CSTM/${date.getTime()}`,
                delivery_option: selectedDelivery.split('-')[0],
                delivery_charge: parseInt(selectedDelivery.split('-')[1]),
                province: address.province,
                city: address.city,
                city_id: address.city_id,
                district: address.district,
                address_detail: address.address_detail,
                receiver: address.receiver
            }));

            if (user.user_id) {
                if (user.status == 'VERIFIED') {
                    if (selectedDelivery == 'default-0' && !prescriptionImage) {
                        setBtnThrottle(false)
                        toast({
                            title: `Please make sure your form is not empty`,
                            position: 'top',
                            status: 'error',
                            duration: 3000,
                            isClosable: true
                        })

                    } else if (selectedDelivery == 'default-0') {
                        setBtnThrottle(false)
                        toast({
                            title: `Please choose delivery option first`,
                            position: 'top',
                            status: 'error',
                            duration: 3000,
                            isClosable: true
                        })
                    } else if (!prescriptionImage) {
                        setBtnThrottle(false)
                        toast({
                            title: `Please upload your doctor prescription`,
                            position: 'top',
                            status: 'error',
                            duration: 3000,
                            isClosable: true
                        })
                    } else {
                        let resInsert = await axios.post(API_URL + '/transaction/add_custom_transaction', formData, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (resInsert.data.success) {
                            setPrescription('');
                            setSelectedImage(null);
                            setSelectedDelivery('default-0');
                            setBtnThrottle(false)
                            toast({
                                title: `Order processed by admin`,
                                description: 'Your order will be ready in few moment',
                                position: 'top',
                                status: 'success',
                                duration: 5000,
                                isClosable: true
                            });
                            setTimeout(navigate('/transaction_list'), 2000)
                        }
                    }
                } else {
                    setBtnThrottle(false)
                    toast({
                        title: `Order can't be processed`,
                        description: 'Please verify your account first',
                        position: 'top',
                        status: 'error',
                        duration: 3000,
                        isClosable: true
                    })
                }

            } else {
                setBtnThrottle(false)
                toast({
                    title: `Order can't be processed`,
                    description: 'Please log in first',
                    position: 'top',
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                })
            };

        } catch (error) {
            console.log(error);
        }

    };


    return (
        <div className='bg-bgWhite'>
            <div className='h-screen py-5 px-5 bg-white'>
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

                        {/* Prescription */}

                        <div className=' my-4' >
                            <div>
                                <p className='text-hijauBtn text-[24px] font-bold mb-3'>Upload prescription</p>
                                <div className='mx-auto border h-[300px] lg:h-[450px] lg:flex items-center'>
                                    {
                                        prescriptionImage ?
                                            <div className='mx-auto relative'>
                                                <p onClick={() => { setPrescription(''); setSelectedImage(null) }} className='p-2 absolute cursor-pointer'><HiXCircle /></p>
                                                <img src={selectedImage} className='object-contain h-[400px] p-6' alt="" />
                                            </div>
                                            :
                                            <div className='mx-auto'>
                                                <AiOutlineUpload className='mx-auto text-hijauBtn text-[120px]' />
                                                <p className='text-center text-muted text-[24px]'>Upload your prescription here</p>
                                                <div className='flex justify-center lg:mt-6'>
                                                    <input onChange={addImage} className='text-white lg:w-[125px] p-2 rounded file:border-none file:bg-btnHijau file:rounded file:text-black file:p-1 file:px-2 file:cursor-pointer' type="file" />
                                                </div>
                                            </div>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Checkout Component */}
                    <div className='lg:border lg:rounded lg:w-[350px] lg:h-[400px] px-5'>
                        <p className='hidden lg:block text-poppins text-hijauBtn font-bold pt-5 text-[24px] border-b pb-[16px]'>Order detail</p>

                        <div className='pt-5'>
                            <div className='py-1'>
                                <p className='py-2 text-hijauBtn'>Delivery option</p>
                                <Select onChange={(e) => setSelectedDelivery(e.target.value)} >
                                    <option value="default-0" selected>Select option</option>
                                    {printDeliveryOption()}
                                </Select>
                            </div>

                            <div className='py-1 pt-3 flex justify-between'>
                                <p className='text-hijauBtn'>Delivery charge</p>
                                <p className='text-hijauBtn font-bold lg:pb-[8px]'>Rp{parseInt(selectedDelivery.split('-')[1]).toLocaleString('id')},-</p>
                            </div>

                            <div className='py-1 pt-3 flex'>
                                <span className='text-hijauBtn  lg:pb-[8px]'>  Total purchase will be shown in transaction list after admin served your order</span>
                            </div>

                        </div>

                        {
                            user.status == 'VERIFIED' && user.user_id ?
                                addressList.length > 0 ?
                                    <button onClick={() => { setTimeout(btnOrder, 2000); setBtnThrottle(true) }} className={`mx-auto bg-hijauBtn ${btnThrottle ? 'hover:bg-brightness-90' : 'hover:bg-white hover:text-hijauBtn'} text-white border w-[290px] lg:w-[312px] h-[42px] lg:h-[40px] font-bold`}>
                                        {btnThrottle ? <Spinner size='xs' /> : 'Order'}
                                    </button>
                                    :
                                    <button className={`mx-auto bg-hijauBtn disabled:cursor-not-allowed text-white border w-[290px] lg:w-[312px] h-[42px] lg:h-[40px] font-bold`} disabled>
                                        Order
                                    </button>
                                :
                                <div className='py-1 pt-3 flex'>
                                    <span className='text-red-500 lg:pb-[8px]'>  To order by prescription please register or verify your account first </span>
                                </div>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrescriptionPage;