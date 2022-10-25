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
						<div className='flex justify-between'>
							<h2 className="flex text-xs">{new Date(selectedTransaction.order_date)?.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
							<h1 className="flex text-xs font-bold">INVOICE ID: <span className="text-xs font-normal ml-2">{selectedTransaction.invoice}</span></h1>
						</div>
            <hr className="my-2" />
						<h1 className="text-sm font-bold text-center text-borderHijau">{selectedTransaction.transaction_status?.toUpperCase()}</h1>
            <hr className="mt-2 mb-5" />

						{
							selectedTransaction.transaction_detail?.map((val, idx) => {
								return (
									<ol key={idx}>
										<li>
											<p className="font-bold text-xs mt-2 mb-1">{idx + 1}. {val.product_name}</p>
											<div className='flex justify-between'>
												<div className='w-[20%]'>
													<img
														className="max-w-[50px] ml-5 flex"
														src={
															val.product_image.includes('http')
															? val.product_image
															: `http://localhost:8000/${val.product_image}`
														}
														alt="product_image"
													/>
												</div>
												<div className='flex w-[80%] justify-between align-middle'>
													<div>
														<p className="text-xs mt-4">{val.quantity} x {val.product_unit} @Rp{val.product_price?.toLocaleString('id')}.-</p>
													</div>
													<div>
														<p className="text-xs mt-4">Rp{(val.product_price * val.quantity)?.toLocaleString('id')}.-</p>
													</div>
												</div>
											</div>
											<hr className="my-2" />
										</li>
									</ol>
								)
							})
						}

						<h1 className="text-xs font-bold mb-[5px] text-end">{selectedTransaction.transaction_detail?.length} {selectedTransaction.transaction_detail?.length > 1 ? 'ITEMS' : 'ITEM'}<span className="text-xs font-normal mb-[5px] ml-2">Rp{selectedTransaction.total_purchase > 0 ? (selectedTransaction.total_purchase - selectedTransaction.delivery_charge)?.toLocaleString('id') : 0},-</span></h1>
						<h1 className="text-xs font-bold mb-[5px] text-end">SHIPPING ({selectedTransaction.delivery_option})<span className="text-xs font-normal mb-[5px] ml-2">Rp{selectedTransaction.total_purchase > 0 ? selectedTransaction.delivery_charge?.toLocaleString('id') : 0},-</span></h1>
						<h1 className="text-xs font-bold mt-4 mb-2 text-end">TOTAL PURCHASE<span className="text-xs font-normal ml-2">Rp{selectedTransaction.total_purchase > 0 ? selectedTransaction.total_purchase?.toLocaleString('id') : 0},-</span></h1>
            
						<hr className="my-2" />
						<h1 className="text-sm font-bold text-center text-borderHijau">SHIPPING</h1>
            <hr className="my-2" />
						<h1 className="text-xs font-bold mt-2 mb-1">Shipping Option</h1>
						<h1 className="text-xs font-bold mb-2"><span className="text-xs font-normal">{selectedTransaction.delivery_option}</span></h1>
						<h1 className="text-xs font-bold mt-2 mb-1">Shipping Address</h1>
						<h1 className="text-xs font-bold mb-2"><span className="text-xs font-normal">{selectedTransaction.address_detail}, {selectedTransaction.district}, {selectedTransaction.city}, {selectedTransaction.province}.</span></h1>
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
