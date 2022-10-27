import React from 'react';
import ButtonComponent from './ButtonComponent';
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useDisclosure, useToast } from '@chakra-ui/react';
import AddressTableComponent from './AddressTableComponent';
import Axios from 'axios';
import { API_URL } from '../helper';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { getAddress, userAddress } from '../slices/addressSlice';

export default function AddressComponent() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataProvince, setDataProvince] = React.useState([]);
  const [dataCity, setDataCity] = React.useState([]);
  const [address, setAddress] = React.useState('');
  const [district, setDistrict] = React.useState('');
  const [provinceId, setProvinceId] = React.useState('');
  const [cityId, setCityId] = React.useState('');
  const [city, setCity] = React.useState('');
  const [province, setProvince] = React.useState('');
  const [receiver, setReceiver] = React.useState('');
  const toast = useToast();
  const dispatch = useDispatch();

  const addressList = useSelector(getAddress);

  const getDataProvince = () => {
    Axios.get(API_URL + '/rajaOngkir/get_province')
      .then((res) => {
        setDataProvince(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  };

  const getDataCity = async (province_id) => {
    try {
      let res = await Axios.post(API_URL + '/rajaOngkir/get_city', {
        "province": province_id.split('-')[0]
      });
      setDataCity(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const btnSaveAddress = async () => {
    try {
      if (!provinceId || !cityId || !district || !address || !receiver) {
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
        let res = await Axios.post(API_URL + '/user/add_address', {
          province,
          city,
          city_id: cityId,
          address_detail: address,
          district,
          receiver
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.data.success) {
          let getData = await Axios.get(API_URL + '/user/get_address', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log(getData.data);
          dispatch(userAddress(getData.data));
          toast({
            title: 'Address successfully added',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top'
          })
          onClose();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAddressData = async () => {
    try {
      let token = Cookies.get('sehatToken');
      if (token) {
        let response = await Axios.get(API_URL + '/user/get_address', {
          headers : {
            'Authorization' : `Bearer ${token}`
          }
        })
        if (response.data) {
          dispatch(userAddress(response.data))
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => {
    getDataProvince();
    getAddressData();
  }, []);

  return (
    <div className='mt-5 '>
      <div className='flex justify-between items-center mx-7'>
        <h1 className='font-semibold text-lg'>
          Address
        </h1>
        <div className='space-x-3'>
          <ButtonComponent text='Add address' class='border-hijauBtn border rounded-full hover:bg-hijauBtn hover:text-white font-medium' py='2' px='4' onclick={onOpen} />
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add a new Address</ModalHeader>
              <ModalCloseButton />
              <ModalBody className='space-y-3'>
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
                  <Input placeholder='Address details' onChange={(e) => setAddress(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>Receiver</FormLabel>
                  <Input placeholder='Receiver name' onChange={(e) => setReceiver(e.target.value)} />
                </FormControl>
              </ModalBody>
              <ModalFooter className='space-x-3'>
                <Button colorScheme='teal' onClick={btnSaveAddress}>Save</Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </div>
      <AddressTableComponent data={addressList} />
    </div>
  )
}
