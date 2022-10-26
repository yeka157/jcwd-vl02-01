import axios from 'axios';
import React, { useState } from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";
import { API_URL } from '../helper';
import { useNavigate } from 'react-router-dom';
import {
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    size
} from '@chakra-ui/react'



const CartComponent = (props) => {

    const [selected, setSelected] = useState([]);

    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const navigate = useNavigate();

    const onDec = async (idCart) => {
        try {
            let cartIdx = props.cart.findIndex(val => val.cart_id == idCart);

            if (props.cart[cartIdx].quantity > 1) {

                let res = await axios.patch(API_URL + `/cart/decrement_cart_qty/${idCart}`, { substraction: 1 });

                if (res.data.succes) {
                    props.getData();

                }
            }

        } catch (error) {
            console.log(error);
        }

    };

    const onInc = async (idCart) => {
        let cartIdx = props.cart.findIndex(val => val.cart_id == idCart);

        if (props.cart[cartIdx].product_stock > props.cart[cartIdx].quantity) {

            let res = await axios.patch(API_URL + `/cart/increment_cart_qty/${idCart}`, { addition: 1 });

            if (res.data.succes) {
                props.getData();

            }

        } else {
            toast({
                title: `We are sorry`,
                description: 'You just reach our stock limit for this product',
                status: 'error',
                isClosable: true,
                position: 'top'
            })
        }
    };

    const btnDelete = async () => {
        try {

            let resDelete = await axios.delete(API_URL + `/cart/delete_item/${props.data.cart_id}`);

            if (resDelete.data.succes) {  
                onClose();
                setSelected([]);
                props.getData();
            }

        } catch (error) {
            console.log(error);
        }
    };

    const onCheckBox = async (cart_id, value) => {
        try {

            let result = {};
            if (value == 1) {
                result = await axios.patch(API_URL + `/cart/check_item/${cart_id}`, { status: 0 });
            } else {
                result = await axios.patch(API_URL + `/cart/check_item/${cart_id}`, { status: 1 });
            }

            if (result.data.succes) {
                props.getData();
            }

        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className='lg:flex border-b py-4'>
            <div className='my-5 flex lg:w-2/3'>
                <div className='flex items-center'>
                    <input type="checkbox" className='w-[20px] h-[20px] accent-hijauBtn' onClick={() => onCheckBox(props.data.cart_id, props.data.is_selected)} checked={props.data.is_selected == 1 ? true : false} />
                </div>

                <div className='lg:w-[180px] w-[75px] mx-4'>
                    <img src={props.data.product_image.includes('http') ? props.data.product_image : `http://localhost:8000$/{props.data.product_image}`} alt="" />
                </div>

                <div className='flex items-center w-[300px] lg:w-[220px]'>
                    <div>
                        <p className='text-hijauBtn'>{props.data.product_name}</p>
                        <p className='font-bold text-hijauBtn'>Rp{props.data.product_price.toLocaleString('id')},-</p>
                    </div>
                </div>
            </div>


            <div className='flex items-center lg:w-full'>
                <div className='ml-[150px] lg:ml-[12px] lg:h-[180px] lg:w-[350px] flex lg:flex-row-reverse pb-5'>

                    <div className='flex items-center mx-5'>
                        <div>
                            <RiDeleteBin6Line onClick={() => onOpen()} className='text-[24px] cursor-pointer hover:text-red-500' />

                            <Modal onClose={onClose} size='xs' isOpen={isOpen}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader >Delete confirmation</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        <div>
                                            <p >Are you sure want to delete this item?</p>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button className='mx-2' colorScheme={'red'} onClick={btnDelete}>Delete</Button>
                                        <Button onClick={() => { setSelected([]); onClose(); }}>Close</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </div>
                    </div>

                    <div className='hidden lg:flex items-center w-[200px] lg:w-[400px] mx-[12px]'>
                        <div>
                            <p className='font-bold text-hijauBtn'>Rp{(props.data.product_price * props.data.quantity).toLocaleString('id')},-</p>
                        </div>
                    </div>

                    <div className='flex items-center lg:w-[300px] lg:mr-[32px]'>
                        <button onClick={() => { onDec(props.data.cart_id) }} className={`border px-2  ${props.data.quantity == 1 ? 'hover:text-grey hover:bg-grey text-grey' : 'hover:text-white hover:bg-hijauBtn'}`} disabled={props.data.quantity == 1 ? true : false}>-</button>
                        <span className='px-2 border'>{props.data.quantity}</span>
                        <button onClick={() => { onInc(props.data.cart_id) }} className='border px-1 hover:text-white hover:bg-hijauBtn'>+</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartComponent;