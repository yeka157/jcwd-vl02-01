import React from 'react';
import { MdLocationOn } from "react-icons/md";
import {
    Select,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button
} from '@chakra-ui/react';
import CheckoutComponent from '../components/CheckoutComponent';
import { useState } from 'react';
import { API_URL } from '../helper';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import axios from 'axios';
import { getUser } from "../slices/userSlice";
import { useSelector } from 'react-redux';
import { getAddress } from '../slices/addressSlice';

const CheckoutPage = (props) => {

    const [item, setItem] = useState([]);
    const [deliveryOption, setDeliveryOption] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState('default-0');
    const [address, setAddress] = useState({});

    const toast = useToast();
    const user = useSelector(getUser);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const addressList = useSelector(getAddress);

    useEffect(() => {
        getData();
        getMainAddress();
    }, []);

    let getData = async () => {
        try {
            let token = Cookies.get('sehatToken');

            let resData = await axios.get(API_URL + '/cart//checkouted_item', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (resData.data.succes) {
                setItem(resData.data.items);
            };

        } catch (error) {
            console.log(error);
        }
    };

    const getMainAddress = async () => {
        try {
            let token = Cookies.get('sehatToken');

            let resAddress = await axios.get(API_URL + '/cart/checkout_main_address', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (resAddress.data.success) {
                setAddress(resAddress.data.address);
                getDeliveryService(resAddress.data.address.city_id);

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
                <option key={idx} value={`${val.name} ${val.service}-${val.cost[0].value}`}>{`${val.name} ${val.service} - Rp. ${val.cost[0].value.toLocaleString('id')} (${val.cost[0].etd} days)`}</option>
            )
        })

        return print
    };

    const printSubTotal = () => {
        let total = 0;

        item.forEach(val => {
            total += val.quantity * val.product_price
        })

        return total;
    };

    const printTotalPurchase = () => {
        return printSubTotal() + parseInt(selectedDelivery.split('-')[1]);
    };

    console.log(address);

    const btnOrder = () => {
        if (selectedDelivery != 'default-0') {

            let date = new Date()

            let data = {
                user_id: user.user_id,
                transaction_status: 'Unpaid',
                invoice: `INV/${date.getTime()}`,
                total_purchase: printTotalPurchase(),
                delivery_option: selectedDelivery.split('-')[0],
                delivery_charge: parseInt(selectedDelivery.split('-')[1]),
                province: address.province,
                city: address.city,
                city_id: address.city_id,
                district: address.district,
                address_detail: address.address_detail,
                transaction_detail: item
            }

            console.log(data);


        } else {
            toast({
                title: `Order can't be processed`,
                description: 'You have not choose the delivery option',
                position: 'top',
                status: 'error',
                duration: 3000,
                isClosable: true
            })
        }
    };

    // Pindah ke component
    const addressOptionModal = (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Choose address</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <>
                            {
                                addressList.map((val, idx) => {
                                    return (
                                        <div className='border rounded-lg my-2 cursor-pointer hover:bg-hijauBtn hover:text-white' onClick={() => { setAddress(val); getDeliveryService(val.city_id); onClose(); }}>
                                            <div className='p-2'>
                                                <p className='text-btnHijau'>{val.address_detail}</p>
                                                <p className='text-btnHijau'>{`${val.city}, ${val.province}`}</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='teal' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )

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
                            <div className='py-3'>
                                <p className='font-bold text-hijauBtn'>{`${user.name} - ${user.phone_number}`}</p>
                                <p>{address.address_detail}</p>
                                <p>{`${address.district}, ${address.city}, ${address.province}`}</p>
                            </div>
                            <div className='flex lg:justify-end pb-3'>
                                <button onClick={() => onOpen()} className='mr-2 my-2 bg-hijauBtn hover:bg-white text-white hover:text-hijauBtn border w-[170px] h-[42px] font-bold '>
                                    Change Address
                                </button>
                                {addressOptionModal}

                                <button className='ml-2 my-2 bg-hijauBtn hover:bg-white text-white hover:text-hijauBtn border w-[170px] h-[42px] font-bold'>
                                    Add new address
                                </button>
                            </div>
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
                                <p className='text-hijauBtn font-bold lg:pb-[8px]'>RP. {parseInt(selectedDelivery.split('-')[1]).toLocaleString('id')},-</p>
                            </div>

                            <div className='py-1 flex justify-between'>
                                <p className='text-hijauBtn'>Sub total</p>
                                <p className='text-hijauBtn font-bold lg:pb-[8px]'>RP. {printSubTotal().toLocaleString('id')},-</p>
                            </div>

                            <div className='py-1 border-t mt-3'>
                                <p className='text-hijauBtn'>Total purchase</p>
                                <p className='text-hijauBtn text-[32px] font-bold'>RP. {printTotalPurchase().toLocaleString('id')},-</p>
                            </div>
                        </div>

                        <button onClick={btnOrder} className='mx-auto  bg-hijauBtn hover:bg-white text-white hover:text-hijauBtn border w-[290px] lg:w-[312px] h-[42px] lg:h-[40px] font-bold lg:mt-[24px]'>
                            Order
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage;