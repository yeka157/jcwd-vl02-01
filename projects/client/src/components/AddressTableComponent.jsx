import { Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import React from 'react';
import AddressListComponent from './AddressListComponent';
import Axios from 'axios';
import { API_URL } from '../helper';
import { useDispatch } from 'react-redux';
import { userAddress } from '../slices/addressSlice';

export default function AddressTableComponent(props) {
  const dispatch = useDispatch();

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
    getAddressData();
  }, []);
  
  return (
    <div className='w-full'>
        <TableContainer>
        <Table size='sm'>
          <Thead>
            <Tr>
              <Th className='px-1'>No</Th>
              <Th className='px-1'>Province</Th>
              <Th className='px-1'>City</Th>
              <Th className='px-1'>District</Th>
              <Th className='px-1'>Address Details</Th>
              <Th className='px-1'>Receiver Name</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {props.data.map((val, idx) => {
              return (
                <AddressListComponent city={val.city} province={val.province} district={val.district} address={val.address_detail} no={idx+1} id={val.address_id} city_id={val.city_id} main={val.main_address} receiver={val.receiver} key={idx+1}/>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  )
}
