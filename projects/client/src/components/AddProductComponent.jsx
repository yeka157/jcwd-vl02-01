import React, { useState, useEffect } from 'react';
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Select,
	Box,
	Textarea,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	FormControl,
	Input,
	useToast,
} from '@chakra-ui/react';
import { AiOutlinePaperClip } from 'react-icons/ai';
import { HiOutlineChevronDown } from 'react-icons/hi';
import axios from 'axios';
import { API_URL } from '../helper';

export default function AddProductComponent({ initialRef, finalRef, isOpenAddProduct, onCloseAddProduct, categoryData, getProductData, productData, setCurrentPage, totalData, itemsPerPage, currentPage }) {
	const [form, setForm] = useState({
		category_id: 0,
		category_name: '',
		product_name: '',
		product_price: 0,
		product_image: '',
		product_description: '',
		product_usage: '',
		default_unit: '',
		product_stock: 0,
	});

	const toast = useToast();

	const totalPage = Math.ceil(totalData / itemsPerPage);

	const btnAddProduct = async () => {
		let message = '';
		try {
			let formData = new FormData();
			formData.append(
				'data',
				JSON.stringify({
					category_id: form.category_id,
					category_name: form.category_name,
					product_name: form.product_name,
					product_price: form.product_price,
					product_description: form.product_description,
					product_usage: form.product_usage,
					default_unit: form.default_unit,
					product_stock: form.product_stock,
				})
			);

			formData.append('product_image', form.product_image);

			let res = await axios.post(`${API_URL}/product/add_product`, formData);
			message = res.data.message;

			if (res.data.success) {
				getProductData();
				setCurrentPage((prev) => prev = 1);
				toast({
					size: 'xs',
					title: `${form.product_name} has been added to product list!`,
					position: 'top-right',
					status: 'success',
					isClosable: true,
				});
			} else {
				toast({
					size: 'xs',
					title: `Failed to add ${form.product_name} to product list: ${message}`,
					position: 'top-right',
					status: 'error',
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				size: 'xs',
				title: `Failed to add ${form.product_name} to product list: ${message}`,
				position: 'top-right',
				status: 'error',
				isClosable: true,
			});
			console.log(error);
		}
	};

	useEffect(() => {
		if (!isOpenAddProduct) {
			setForm({
				category_id: 0,
				category_name: '',
				product_name: '',
				product_price: 0,
				product_image: '',
				product_description: '',
				product_usage: '',
				default_unit: '',
				product_stock: 0,
			});
		}
	}, [isOpenAddProduct]);

	// useEffect(() => {
	// 	getProductData();
	// }, [currentPage]);

	return (
		<div>
			<Modal className="bg-bgWhite" initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpenAddProduct} onClose={onCloseAddProduct} isCentered size={'lg'}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontSize="md">Add new product</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={2}>
						<FormControl>
							<Input
								required
								className="text-borderHijau my-2"
								borderRadius="0"
								size="sm"
								ref={initialRef}
								placeholder="Product name"
								_focusVisible={{ outline: '2px solid #1F6C75' }}
								_placeholder={{ color: 'inherit' }}
								color="gray"
								onChange={(e) => setForm((prev) => ({ ...prev, product_name: e.target.value }))}
							/>

							<Menu>
								<MenuButton
									className="my-2 w-[100%] border-[1px] border-gray text-xs"
									color={'gray'}
									bgColor={'white'}
									style={{ borderRadius: 0 }}
									as={Button}
									rightIcon={<HiOutlineChevronDown />}
									size={'sm'}
								>
									{form.category_name === '' ? 'Product category' : form.category_name}
								</MenuButton>
								<MenuList>
									<MenuItem
										className="text-xs"
										color={'gray'}
										onClick={() => {
											setForm((prev) => ({ ...prev, category_id: 0, category_name: '' }));
										}}
									>
										None
									</MenuItem>
									{categoryData.map((val, idx) => {
										return (
											<MenuItem
												key={idx}
												className="text-xs"
												color={'gray'}
												onClick={() => {
													setForm((prev) => ({ ...prev, category_id: val.category_id, category_name: val.category_name }));
												}}
											>
												{val.category_name}
											</MenuItem>
										);
									})}
								</MenuList>
							</Menu>

							<NumberInput size="sm" min={1} className="text-borderHijau my-2">
								<NumberInputField
									borderRadius="0"
									placeholder="Product price"
									color="gray"
									_focusVisible={{ outline: '2px solid #1F6C75' }}
									_placeholder={{ color: 'inherit' }}
									onChange={(e) => setForm((prev) => ({ ...prev, product_price: parseInt(e.target.value) }))}
								/>
							</NumberInput>

							<Textarea
								required
								className="text-borderHijau my-2 max-h-[75px]"
								borderRadius="0"
								size="sm"
								placeholder="Product description"
								_focusVisible={{ outline: '2px solid #1F6C75' }}
								_placeholder={{ color: 'inherit' }}
								color="gray"
								onChange={(e) => setForm((prev) => ({ ...prev, product_description: e.target.value }))}
							/>

							<Textarea
								required
								className="text-borderHijau my-2 max-h-[75px]"
								borderRadius="0"
								size="sm"
								placeholder="Product usage"
								_focusVisible={{ outline: '2px solid #1F6C75' }}
								_placeholder={{ color: 'inherit' }}
								color="gray"
								onChange={(e) => setForm((prev) => ({ ...prev, product_usage: e.target.value }))}
							/>

							<NumberInput size="sm" min={1} className="text-borderHijau my-2">
								<NumberInputField
									borderRadius="0"
									placeholder="Stock"
									color="gray"
									_focusVisible={{ outline: '2px solid #1F6C75' }}
									_placeholder={{ color: 'inherit' }}
									onChange={(e) => setForm((prev) => ({ ...prev, product_stock: parseInt(e.target.value) }))}
								/>
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>

							<Input
								required
								className="text-borderHijau my-2 inline"
								borderRadius="0"
								size="sm"
								placeholder="Default unit"
								_focusVisible={{ outline: '2px solid #1F6C75' }}
								_placeholder={{ color: 'inherit' }}
								color="gray"
								onChange={(e) => setForm((prev) => ({ ...prev, default_unit: e.target.value }))}
							/>

							<Box borderWidth="1px" overflow="hidden" className="text-center p-3 my-2">
								<div className="wrapper">
									<input
										type="file"
										id="file-input"
										onChange={(e) => {
											const file = e.target?.files[0];
											setForm((prev) => ({ ...prev, product_image: file }));
										}}
									/>
									<label htmlFor="file-input">
										<AiOutlinePaperClip size={17} className="inline" color="gray" />
										<h1 className="inline ml-1 font-semibold text-sm text-gray-500"></h1>
										{form.product_image ? (
											<p className="inline ml-1 font-semibold text-sm text-gray-500">{form.product_image.name}</p>
										) : (
											<p className="inline ml-1 font-semibold text-sm text-gray-500">Choose Profile Picture</p>
										)}
									</label>
								</div>
							</Box>

							{/* <h1 className="text-xs font-bold mt-[10px] mb-[5px]">Stock</h1>
							<NumberInput placeholder='stock' min={1}> 
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput> */}
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button
							size="sm"
							colorScheme="teal"
							mr={3}
							onClick={() => {
								if (
									form.category_id &&
									form.category_name &&
									form.product_name &&
									form.product_price &&
									form.product_image &&
									form.product_description &&
									form.product_usage &&
									form.default_unit &&
									form.product_stock
								) {
									btnAddProduct();
									setForm({
										category_id: 0,
										category_name: '',
										product_name: '',
										product_price: 0,
										product_image: '',
										product_description: '',
										product_usage: '',
										default_unit: '',
										product_stock: 0,
									});
									
									onCloseAddProduct();
									
								} else {
									toast({
										size: 'xs',
										title: `Please check and fill all the form field!`,
										position: 'top-right',
										status: 'error',
										isClosable: true,
									});
								}
							}}
						>
							Save
						</Button>
						<Button
							size="sm"
							onClick={() => {
								onCloseAddProduct();
								setForm({
									category_id: 0,
									category_name: '',
									product_name: '',
									product_price: 0,
									product_image: '',
									product_description: '',
									product_usage: '',
									default_unit: '',
									product_stock: 0,
								});
							}}
						>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
