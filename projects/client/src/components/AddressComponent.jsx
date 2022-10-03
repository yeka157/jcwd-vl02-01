import React from 'react';
import ButtonComponent from './ButtonComponent';
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Table, TableContainer, Tbody, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import AddressTableComponent from './AddressTableComponent';

export default function AddressComponent() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className='mt-5 mx-7'>
      <div className='flex justify-between items-center'>
        <h1 className='font-semibold text-lg'>
            Address
        </h1>
        <ButtonComponent text='Add address' class='border-hijauBtn border rounded-full hover:bg-hijauBtn hover:text-white font-medium' py='2' px='4' onclick={onOpen}/>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay/>
          <ModalContent>
            <ModalHeader>Add a new Address</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
              <FormControl>
                <FormLabel>Province</FormLabel>
                <Input placeholder='Province'/>
              </FormControl>
              <FormControl>
                <FormLabel>City</FormLabel>
                <Input placeholder='City'/>
              </FormControl>
              <FormControl>
                <FormLabel>Details</FormLabel>
                <Input placeholder='Address details'/>
              </FormControl>
            </ModalBody>
            <ModalFooter className='space-x-3'>
              <Button colorScheme='teal'>Save</Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <AddressTableComponent/>
    </div>
  )
}
