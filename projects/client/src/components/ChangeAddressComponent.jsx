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
    Button,
    FormControl,
    FormLabel,
    Input
} from '@chakra-ui/react';
import { useState } from 'react';
import { API_URL } from '../helper';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { userAddress  } from '../slices/addressSlice';

const ChangeAddressComponent = (props) => {
    const [dataProvince, setDataProvince] = useState([]);
    const [dataCity, setDataCity] = useState([]);
    const [province, setProvince] = useState('');
    const [provinceId, setProvinceId] = useState('');
    const [city, setCity] = useState('');
    const [cityId, setCityId] = useState('');
    const [district, setDistrict] = useState('');
    const [addressDetail, setAddressDetail] = useState('');
    const [addAddressToggle, setAddAddressToggle] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const dispatch = useDispatch();

    useEffect(() => {
        getDataProvince();
    }, []);

    const btnChangeAddress = (address) => {
        props.setAddress(address)
        props.getDeliveryService(address.city_id)
        onClose();
        toast({
            title: `Address successfully changed`,
            position: 'top',
            status: 'success',
            duration: 3000,
            isClosable: true
        })
    };

    const getDataProvince = () => {
        axios.get(API_URL + '/rajaOngkir/get_province')
            .then((res) => {
                setDataProvince(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    };

    const getDataCity = async (province_id) => {
        try {
            let res = await axios.post(API_URL + '/rajaOngkir/get_city', {
                "province": province_id.split('-')[0]
            });
            setDataCity(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const btnSaveAddress = async () => {
        try {
            if (!provinceId || !cityId || !district || !addressDetail) {
                toast({
                    title: 'Please complete the address form',
                    description: 'Make sure to fill the entire form',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top'
                })
            } else {
                let token = Cookies.get('sehatToken');
                let res = await axios.post(API_URL + '/user/add_address', {
                    province,
                    city,
                    city_id: cityId,
                    address_detail: addressDetail,
                    district
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.data.success) {
                    let getData = await axios.get(API_URL + '/user/get_address', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    dispatch(userAddress(getData.data));
                    toast({
                        title: 'Address successfully added',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                        position: 'top'
                    })
                    setAddAddressToggle(!addAddressToggle);
                    props.getMainAddress();
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

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
                                props.addressList.map((val, idx) => {
                                    return (
                                        <div className='border rounded-lg my-2 cursor-pointer hover:bg-hijauBtn hover:text-white' onClick={() => btnChangeAddress(val)}>
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
    );

    const addAddressModal = (
        <Modal isOpen={addAddressToggle} onClose={() => setAddAddressToggle(!addAddressToggle)}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add a new Address</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Province</FormLabel>
                        <Select placeholder='Select province' onChange={(e) => { setProvinceId(e.target.value.split('-')[0]); getDataCity(e.target.value); setProvince(e.target.value.split('-')[1]) }}>
                            {dataProvince.map((val) => {
                                return (
                                    <option key={val.province_id} value={`${val.province_id}-${val.province}`}>{val.province}</option>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>City</FormLabel>
                        <Select placeholder='Select city' onChange={(e) => { setCityId(e.target.value.split('-')[0]); setCity(e.target.value.split('-')[1]) }}>
                            {dataCity.map((val) => {
                                return (
                                    <option key={val.city_id} value={`${val.city_id}-${val.type} ${val.city_name}`}>{val.type} {val.city_name}</option>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>District</FormLabel>
                        <Input placeholder='District' onChange={(e) => setDistrict(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Details</FormLabel>
                        <Input placeholder='Address details' onChange={(e) => setAddressDetail(e.target.value)} />
                    </FormControl>
                </ModalBody>
                <ModalFooter className='space-x-3'>
                    <Button colorScheme='teal' onClick={btnSaveAddress}>Save</Button>
                    <Button onClick={() => setAddAddressToggle(!addAddressToggle)}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )

    return (
        <div className='flex lg:justify-end pb-3'>
            <button onClick={() => onOpen()} className='mr-2 my-2 bg-hijauBtn hover:bg-white text-white hover:text-hijauBtn border w-[170px] h-[42px] font-bold '>
                Change address
            </button>
            {addressOptionModal}

            <button className='ml-2 my-2 bg-hijauBtn hover:bg-white text-white hover:text-hijauBtn border w-[170px] h-[42px] font-bold' onClick={() => setAddAddressToggle(!addAddressToggle)}>
                Add new address
            </button>
            {addAddressModal}
        </div>
    )
};

export default ChangeAddressComponent;