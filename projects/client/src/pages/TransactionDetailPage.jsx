import React, { useEffect, useState, useRef } from 'react';
import { FiShoppingBag } from "react-icons/fi";
import { HiXCircle } from 'react-icons/hi';
import { useLocation, } from "react-router-dom";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    useToast,
    FormControl,
    Input,
    FormLabel,
    Spinner
} from '@chakra-ui/react';
import axios from 'axios';
import { API_URL } from '../helper';
import { getUser } from "../slices/userSlice";
import { useSelector } from 'react-redux';


const TransactionDetailPage = () => {

    const [transactionData, setTransactionData] = useState([]);
    const [images, setImages] = useState('');
    const [selectedImg, setSelectedImg] = useState(null);
    const [loading, setLoading] = useState(true);

    const { isOpen: cancelConfirmation, onOpen: onOpenCancelModal, onClose: onCancelModal } = useDisclosure()
    const { isOpen: orderConfirmation, onOpen: onOrder, onClose: onCloseOrder } = useDisclosure()
    const { isOpen: paymentProof, onOpen: onOpenPayment, onClose: onClosePayment } = useDisclosure()
    const { state } = useLocation();
    const toast = useToast();
    const user = useSelector(getUser);
    const filePickerRef = useRef(null);

    const { address_detail, district, city, province, delivery_charge, delivery_option, doctor_prescription, invoice, order_date, detail, transaction_status, total_purchase } = transactionData;

    const getData = async () => {
        try {
            let resData = await axios.get(`${API_URL}/transaction/transaction_detail/${state.transaction_id}`);
            if (resData.data.success) {
                setTransactionData(resData.data)
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const printSubTotal = () => {
        let total = 0;

        transactionData.detail.forEach(val => {
            total += val.quantity * val.product_price
        })

        return total;
    };

    const addImage = (e) => {
        if (e.target.files[0].type === 'image/png' || e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/jpg' || e.target.files[0].type === 'image/gif') {
            if (e.target.files[0].size > 1048576) {
                toast({
                    title: 'File uploaded is too big',
                    description: 'Max size is 1 MB',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                setImages(e.target.files[0]);
                const reader = new FileReader();
                if (e.target.files[0]) {
                    reader.readAsDataURL(e.target.files[0]);
                }
                reader.onload = (readerEvent) => {
                    setSelectedImg(readerEvent.target.result);
                };
            }
        } else {
            toast({
                title: 'Wrong file format',
                description: 'Your file format is not supported',
                position: 'top',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        getData();
    }, []);


    const cancelModal = (
        <Modal isOpen={cancelConfirmation} onClose={onCancelModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Order Cancellation</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div>
                        <p className='font-medium'>Are you sure want to cancel this order?</p>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='red' mr={3} >
                        Delete
                    </Button>
                    <Button variant='ghost' onClick={onCancelModal}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );

    const orderConfirmationModal = (
        <Modal isOpen={orderConfirmation} onClose={onCloseOrder}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Order Confirmation</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div>
                        <p className='font-medium'>Already recieved the items?</p>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='teal' mr={3} >
                        Yes, confirm
                    </Button>
                    <Button variant='ghost' onClick={onCloseOrder}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );

    const UploadPaymentModal = (
        <Modal
            isOpen={paymentProof}
            onClose={onClosePayment}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Upload Payment Proof</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Payment proof</FormLabel>
                        <div className="border p-2">
                            <Input
                                type="file"
                                hidden
                                ref={filePickerRef}
                                onChange={addImage}
                            />
                            <Button onClick={() => filePickerRef.current.click()}>
                                Browse
                            </Button>
                            {selectedImg && (
                                <div className="relative">
                                    <HiXCircle
                                        className="h-6 w-auto border m-1 p-1 border-white text-black absolute cursor-pointer font-bold rounded-full"
                                        onClick={() => {
                                            setSelectedImg(null);
                                            setImages("");
                                        }}
                                    />
                                    <img
                                        src={selectedImg}
                                        alt="profile-img"
                                        className="mt-2"
                                    />
                                </div>
                            )}
                        </div>
                    </FormControl>
                </ModalBody>
                <ModalFooter className="space-x-3">
                    <Button colorScheme="teal">Upload</Button>
                    <Button
                        onClick={onClosePayment}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )

    return (
        <div>
            {
                !loading ?
                    <div className='min-h-screen px-[50px] py-10 pt-[150px]'>
                        <div className='w-1/2 mx-auto p-10 border rounded shadow'>
                            <div className="flex justify-between border-b pb-2">
                                <div className=" flex">
                                    <div>
                                        <div className='flex '>
                                            <div className="flex items-center mx-2">
                                                <FiShoppingBag />
                                            </div>
                                            <div className="flex items-center mx-2">
                                                <p>{new Date(order_date).toLocaleDateString("en-GB", {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`${transaction_status === 'Cancelled' ? 'bg-red-100 text-[#e53e3e]' : 'bg-[#d6ffde] text-[#37ba69]'} text-green-500  rounded font-bold  flex items-center px-2 mx-2 `}>
                                    {transaction_status}
                                </div>
                            </div>

                            <div className='pt-2 flex justify-between'>
                                <p>Invoice number :</p>
                                <div className="flex items-center mx-2">
                                    <p>{invoice}</p>
                                </div>
                            </div>

                            <div className='border-b'>
                                <p className='font-medium pt-3'>Products details :</p>
                                {
                                    invoice.includes('/CSTM') ?
                                        <div className='m-4'>
                                            <img className='w-[100px]' src={`http://localhost:8000${doctor_prescription}`} alt="" />
                                        </div>
                                        :
                                        detail.map((val, idx) => {
                                            return (
                                                <div className='pt-1'>
                                                    <div className='flex'>
                                                        <div>
                                                            {
                                                                <img className='w-[100px]' src={val.product_image.includes('http') ? val.product_image : `http://localhost:8000${val.product_image}`} alt="" />

                                                            }
                                                        </div>
                                                        <div className='flex items-center'>
                                                            <div>
                                                                <p>{val.product_name}</p>
                                                                <div className='flex'>
                                                                    <p className='text-[14px] mr-2'>{`${val.quantity} x`}</p>
                                                                    <p className='text-[14px]'>Rp{val.product_price.toLocaleString('id')},-</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            )
                                        })
                                }
                            </div>

                            <div className='border-b pb-2'>
                                <p className='font-medium pt-3'>Delivery details :</p>
                                <div className='pt-3 flex'>
                                    <div>
                                        <p>Delivery service</p>
                                        <p>Delivery charge</p>
                                        <p>Address</p>
                                    </div>

                                    <div className='ml-4'>
                                        <p>: {delivery_option}</p>
                                        <p>: Rp{parseInt(delivery_charge).toLocaleString('id')},-</p>
                                        <p>: {user.name} - (+62){user.phone_number}</p>
                                        <p className='pl-2'>{address_detail}</p>
                                        <p className='pl-2'>{district}, {city}</p>
                                        <p className='pl-2'> {province}</p>
                                    </div>

                                </div>
                            </div>

                            <div className='border-b pb-2'>
                                <p className='font-medium pt-3'>Payment details :</p>

                                <div className='flex justify-between'>
                                    <div>
                                        <p>Sub total</p>
                                        <p>Delivery charge</p>
                                    </div>

                                    <div>
                                        {
                                            transaction_status === 'Awaiting Admin Confirmation'
                                                ?
                                                <>
                                                    <p className='font-medium'>Will be shown after served by admin</p>
                                                    <p>Rp{parseInt(delivery_charge).toLocaleString('id')},-</p>
                                                </>
                                                :
                                                <>
                                                    <p>Rp{printSubTotal().toLocaleString('id')},-</p>
                                                    <p>Rp{parseInt(delivery_charge).toLocaleString('id')},-</p>
                                                </>
                                        }

                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-between pb-3'>
                                {
                                    transaction_status === 'Awaiting Admin Confirmation' ?
                                        <>
                                            <p className='font-medium'>Total purchase</p>
                                            <p className='font-medium'>Will be shown after served by admin</p>
                                        </>
                                        :
                                        <>
                                            <p className='font-medium'>Total purchase</p>
                                            <p className='font-medium'>Rp{parseInt(total_purchase).toLocaleString('id')},-</p>
                                        </>
                                }

                            </div>

                            <div className='flex justify-end mt-5 pb-5'>
                                {
                                    transaction_status === 'Awaiting Payment' &&
                                    <>
                                        <Button className='mx-3' colorScheme='red' onClick={onOpenCancelModal}>Cancel Order</Button>
                                        <Button colorScheme='teal' onClick={onOpenPayment}>Upload Payment Proof</Button>
                                    </>
                                }

                                {
                                    transaction_status === 'Shipped' &&
                                    <Button colorScheme='teal' onClick={onOrder}>Confirm Order</Button>
                                }
                            </div>

                            <div>
                                {cancelModal}
                                {UploadPaymentModal}
                                {orderConfirmationModal}
                            </div>
                        </div>
                    </div>
                    :
                    <div className='pt-[25%] h-screen'>
                        <Spinner size='md' className='mx-auto' color={'teal'} />
                    </div>

            }

        </div>
    )
}

export default TransactionDetailPage;