import { Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';
import AddressListComponent from './AddressListComponent';
export default function AddressTableComponent(props) {
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
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {props.data.map((val, idx) => {
              return (
                <AddressListComponent city={val.city} province={val.province} district={val.district} address={val.address_detail} no={idx+1} id={val.address_id} city_id={val.city_id} main={val.main_address}/>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  )
}
