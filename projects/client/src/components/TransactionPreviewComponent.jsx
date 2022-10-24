import React, { useState, useRef, useEffect, useId } from 'react';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Box,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	useToast,
	Badge,
	Input,
	NumberInput,
	NumberInputField,
	FormControl,
	FormLabel,
} from '@chakra-ui/react';

export default function TransactionPreviewComponent({selectedTransaction, isOpen, onClose, initialFocusRef, finalFocusRef}) {
  console.log(selectedTransaction)
  return (
    <div>
      <Modal isCentered size={'xl'} className="bg-bgWhite" initialFocusRef={initialFocusRef} finalFocusRef={finalFocusRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg" className="font-bold text-center">
            {selectedTransaction.doctor_prescription ? "DOCTOR PRESCRIPTION" : "ORDER"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={2}>
            
					<div className="px-[20px]">
						<h1 className="text-xs font-bold mb-[5px]">INVOICE ID: <span className="text-xs font-normal mb-[5px]">{selectedTransaction.invoice}</span></h1>
            <hr className="my-2 mb-2" />

						<h1 className="text-xs font-bold mb-[5px] text-end">Total Purchase: <span className="text-xs font-normal mb-[5px]">Rp{selectedTransaction.total_purchase.toLocaleString('id')},-</span></h1>
            <hr className="my-2" />
					</div>
				</ModalBody>
          <ModalFooter>
            <Button borderRadius={0} size="sm" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
