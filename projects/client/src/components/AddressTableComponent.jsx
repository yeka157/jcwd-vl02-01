import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';
import { FiEdit } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md'; 
export default function AddressTableComponent() {
  return (
    <div>
        <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Province</Th>
              <Th>City</Th>
              <Th>Address Details</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
                <Td>1</Td>
                <Td>West Java</Td>
                <Td>Bandung</Td>
                <Td>Ligar Kencana no. 2B</Td>
                <Td>
                    <div className='flex space-x-3'>
                    <FiEdit className='h-9 hoverIcons text-yellow-500 font-medium'/>
                    <MdDeleteOutline className='h-9 hoverIcons text-red-600'/>
                    </div>
                </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  )
}
