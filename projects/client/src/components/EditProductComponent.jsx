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
	Checkbox,
} from '@chakra-ui/react';
import { AiOutlinePaperClip } from 'react-icons/ai';
import { HiOutlineChevronDown } from 'react-icons/hi';
import axios from 'axios';
import { API_URL } from '../helper';

export default function EditProductComponent({
	initialRef,
	finalRef,
	isOpenEditProduct,
	onCloseEditProduct,
	categoryData,
	getProductData,
	productData,
	selectedProduct,
	selectedProductIndex,
	productStock,
}) {
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
		product_netto: 0,
		product_conversion: '',
	});

	const [selectedForm, setSelectedForm] = useState('details');
	const [checkedItems, setCheckedItems] = useState(false);
	const [checkedDeleteStock, setCheckedDeleteStock] = useState(false);

	const toast = useToast();

	const btnEditProduct = async () => {
		try {
			let formData = new FormData();

			const inputData = {
				category_id: form.category_id ? form.category_id : productData[selectedProductIndex]?.category_id,
				product_name: form.product_name ? form.product_name : productData[selectedProductIndex]?.product_name,
				product_price: form.product_price ? form.product_price : productData[selectedProductIndex]?.product_price,
				product_description: form.product_description ? form.product_description : productData[selectedProductIndex]?.product_description,
				product_usage: form.product_usage ? form.product_usage : productData[selectedProductIndex]?.product_usage,
				default_unit: form.default_unit ? form.default_unit : productData[selectedProductIndex]?.default_unit,
				product_image: productData[selectedProductIndex]?.product_image,
			};

			if (form.product_image) {
				delete inputData.product_image;
				formData.append('product_image', form.product_image);
			}

			formData.append('data', JSON.stringify(inputData));

			let updateProduct = await axios.patch(`${API_URL}/product/update_product/${productData[selectedProductIndex]?.product_id}`, formData);

			if (updateProduct.data.success) {
				if (checkedDeleteStock) {
					let deleteStock = await axios.delete(`${API_URL}/product/delete_stock/${productData[selectedProductIndex]?.product_id}`);
					if (deleteStock.data.success) {
						getProductData();
						toast({
							size: 'xs',
							title: `${selectedProduct} details has been updated!`,
							position: 'top-right',
							status: 'success',
							isClosable: true,
						});
					} else {
						toast({
							size: 'xs',
							title: `Failed to update ${selectedProduct}!`,
							position: 'top-right',
							status: 'error',
							isClosable: true,
						});
					}
				}

				if (productStock?.length > 0 && !checkedDeleteStock) {
					let updateStock = await axios.patch(`${API_URL}/product/update_stock/${productStock[0].stock_id}`, {
						product_id: productData[selectedProductIndex]?.product_id,
						product_stock: form.product_stock ? form.product_stock : productStock[0]?.product_stock,
						product_unit: form.default_unit ? form.default_unit : productData[selectedProductIndex]?.default_unit,
						product_netto: form.product_netto ? form.product_netto : productData[selectedProductIndex]?.product_netto,
						product_conversion: form.product_conversion && form.product_conversion !== '-' ? form.product_conversion : productData[selectedProductIndex]?.product_conversion,
					});

					if (updateStock.data.success) {
						getProductData();
						toast({
							size: 'xs',
							title: `${selectedProduct} details has been updated!`,
							position: 'top-right',
							status: 'success',
							isClosable: true,
						});
					} else {
						toast({
							size: 'xs',
							title: `Failed to update ${selectedProduct}!`,
							position: 'top-right',
							status: 'error',
							isClosable: true,
						});
					}
				}

				if (productStock?.length === 0 && !checkedDeleteStock) {
					let addStock = await axios.post(`${API_URL}/product/add_stock`, {
						product_id: productData[selectedProductIndex]?.product_id,
						product_stock: form.product_stock ? form.product_stock : productStock[0]?.product_stock,
						product_unit: form.default_unit ? form.default_unit : productData[selectedProductIndex]?.default_unit,
						product_netto: form.product_netto ? form.product_netto : productData[selectedProductIndex]?.product_netto ? productData[selectedProductIndex]?.product_netto : 0,
						product_conversion: form.product_conversion && form.product_conversion !== '-' ? form.product_conversion : productData[selectedProductIndex]?.product_conversion ? productData[selectedProductIndex]?.product_conversion : '-',
					});

					if (addStock.data.success) {
						getProductData();
						toast({
							size: 'xs',
							title: `${selectedProduct} details has been updated!`,
							position: 'top-right',
							status: 'success',
							isClosable: true,
						});
					} else {
						toast({
							size: 'xs',
							title: `Failed to update ${selectedProduct}!`,
							position: 'top-right',
							status: 'error',
							isClosable: true,
						});
					}
				}
			}

			onCloseEditProduct();

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
				product_netto: 0,
				product_conversion: '-',
			});
		} catch (error) {
			toast({
				size: 'xs',
				title: `Failed to update product!`,
				position: 'top-right',
				status: 'error',
				isClosable: true,
			});
			console.log(error);
		}
	};

	useEffect(() => {
		if (!isOpenEditProduct) {
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
				product_netto: 0,
				product_conversion: '-',
			});
			setCheckedItems((prev) => (prev = false));
			setSelectedForm((prev) => (prev = 'details'));
			setCheckedDeleteStock((prev) => (prev = false));
		}
	}, [isOpenEditProduct]);

	useEffect(() => {
		getProductData();
	}, []);

	return (
		<div>
			<Modal isCentered className="bg-bgWhite" initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpenEditProduct} onClose={onCloseEditProduct} size={'md'}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontSize="md" className={!checkedDeleteStock ? 'text-center' : ''}>
						{!checkedDeleteStock ? selectedProduct : 'Delete confirmation'}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={2}>
						{checkedDeleteStock && (
							<h1 className="text-sm">
								Are you sure <span className="underline">remove</span> all <span className="text-sm font-bold">{selectedProduct} stock</span> from the list and{' '}
								<span className="underline">update</span> its data?
							</h1>
						)}
						{!checkedDeleteStock && (
							<FormControl>
								<div className="flex justify-center mb-5">
									<h1
										className={`inline text-sm text-center px-10 pb-2 font-semibold ${selectedForm === 'details' ? 'text-borderHijau border-b-2 border-borderHijau' : 'text-gray-400 cursor-pointer'}`}
										onClick={() => {
											setSelectedForm((prev) => (prev = 'details'));
										}}
									>
										Details
									</h1>
									<h1
										className={`inline text-sm text-center px-10 pb-2 font-semibold ${
											selectedForm === 'stock' || selectedForm === 'delete_stock' ? 'text-borderHijau border-b-2 border-borderHijau' : 'text-gray-400 cursor-pointer'
										}`}
										onClick={() => {
											setSelectedForm((prev) => (prev = 'stock'));
										}}
									>
										Stock
									</h1>
								</div>

								{selectedForm === 'details' && (
									<>
										<h1 className="font-semibold text-gray text-xs">Product Name:</h1>
										<Input
											required
											className="text-borderHijau my-2"
											borderRadius="0"
											size="sm"
											ref={initialRef}
											placeholder={selectedProduct}
											_focusVisible={{ outline: '2px solid #1F6C75' }}
											_placeholder={{ color: 'inherit' }}
											color="gray"
											onChange={(e) => setForm((prev) => ({ ...prev, product_name: e.target.value }))}
										/>

										<h1 className="font-semibold text-gray text-xs">Product Category:</h1>
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
												{form.category_name ? form.category_name : productData[selectedProductIndex]?.category_name}
											</MenuButton>
											<MenuList>
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

										<h1 className="font-semibold text-gray text-xs">Product Price:</h1>
										<NumberInput size="sm" min={1} className="text-borderHijau my-2">
											<NumberInputField
												borderRadius="0"
												placeholder={`Rp ${productData[selectedProductIndex]?.product_price.toLocaleString('id')}`}
												color="gray"
												_focusVisible={{ outline: '2px solid #1F6C75' }}
												_placeholder={{ color: 'inherit' }}
												onChange={(e) => setForm((prev) => ({ ...prev, product_price: parseInt(e.target.value) }))}
											/>
										</NumberInput>

										<h1 className="font-semibold text-gray text-xs">Product Description:</h1>
										<Textarea
											required
											className="text-borderHijau my-2 max-h-[100px]"
											borderRadius="0"
											size="sm"
											placeholder={productData[selectedProductIndex]?.product_description}
											_focusVisible={{ outline: '2px solid #1F6C75' }}
											_placeholder={{ color: 'inherit' }}
											color="gray"
											onChange={(e) => setForm((prev) => ({ ...prev, product_description: e.target.value }))}
										/>

										<h1 className="font-semibold text-gray text-xs">Product Usage:</h1>
										<Textarea
											required
											className="text-borderHijau my-2 max-h-[100px]"
											borderRadius="0"
											size="sm"
											placeholder={productData[selectedProductIndex]?.product_usage}
											_focusVisible={{ outline: '2px solid #1F6C75' }}
											_placeholder={{ color: 'inherit' }}
											color="gray"
											onChange={(e) => setForm((prev) => ({ ...prev, product_usage: e.target.value }))}
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
													{form.product_image ? (
														<p className="inline ml-1 font-semibold text-sm text-gray-500">{form.product_image.name}</p>
													) : (
														<p className="inline ml-1 font-semibold text-sm text-gray-500">Choose Product Image</p>
													)}
												</label>
											</div>
										</Box>
									</>
								)}

								{selectedForm === 'stock' && !checkedDeleteStock && (
									<>
										<h1 className="font-semibold text-gray text-xs">Product Stock:</h1>
										<NumberInput size="sm" min={0} className="text-borderHijau my-2">
											<NumberInputField
												borderRadius="0"
												placeholder={productStock[0]?.product_stock ? productStock[0]?.product_stock : 0}
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

										{/* <h1 className="font-semibold text-gray text-xs">Default Unit:</h1>
										<Input
											isDisabled
											className="text-!gray-700 my-2 inline"
											borderRadius="0"
											size="sm"
											placeholder={productData[selectedProductIndex]?.default_unit ? productData[selectedProductIndex]?.default_unit : 'Default unit'}
											_focusVisible={{ outline: '2px solid #1F6C75' }}
											_placeholder={{ color: 'inherit' }}
											onChange={(e) => setForm((prev) => ({ ...prev, default_unit: e.target.value }))}
										/> */}

										{productStock[0]?.product_conversion && productStock[0]?.product_conversion !== '-' && (
											<>
												<hr className="my-2" />
												<h1 className="font-semibold text-gray text-xs mt-2 text-center">
													Conversion: {productStock[0]?.product_netto} {productStock[0]?.product_conversion} per {productData[selectedProductIndex]?.default_unit}
												</h1>
												<hr className="my-2" />
											</>
										)}

										{/* <Checkbox
											_focusVisible={{ outline: '2px solid #1F6C75' }}
											_placeholder={{ color: 'inherit' }}
											colorScheme="teal"
											color={'gray'}
											className="my-2"
											isChecked={checkedItems}
											onChange={(e) => setCheckedItems(e.target.checked)}
										>
											<p className="text-gray text-sm">
												{productStock[0]?.product_conversion && productStock[0]?.product_conversion !== '-' && productStock[0]?.product_conversion
													? 'Edit conversion unit'
													: 'Create new conversion unit'}
											</p>
										</Checkbox>

										{checkedItems && (
											<>
												<h1 className="font-semibold text-gray text-xs mt-2">Product Netto:</h1>
												<NumberInput size="sm" min={0} className="text-borderHijau my-2">
													<NumberInputField
														borderRadius="0"
														placeholder={productStock[0]?.product_netto ? productStock[0]?.product_netto : 0}
														color="gray"
														_focusVisible={{ outline: '2px solid #1F6C75' }}
														_placeholder={{ color: 'inherit' }}
														onChange={(e) => setForm((prev) => ({ ...prev, product_netto: parseInt(e.target.value) }))}
													/>
													<NumberInputStepper>
														<NumberIncrementStepper />
														<NumberDecrementStepper />
													</NumberInputStepper>
												</NumberInput>

												<h1 className="font-semibold text-gray text-xs mt-2">Conversion Unit:</h1>
												<Input
													required
													className="text-borderHijau my-2"
													borderRadius="0"
													size="sm"
													ref={initialRef}
													placeholder={productStock[0]?.product_conversion && productStock[0]?.product_conversion !== '-' ? productStock[0]?.product_conversion : 'Conversion unit'}
													_focusVisible={{ outline: '2px solid #1F6C75' }}
													_placeholder={{ color: 'inherit' }}
													color="gray"
													onChange={(e) => setForm((prev) => ({ ...prev, product_conversion: e.target.value }))}
												/>
											</>
										)}
										<br /> */}
									</>
								)}

								{selectedForm === 'stock' && productStock.length > 0 && (
									<Checkbox
										_focusVisible={{ outline: '2px solid #1F6C75' }}
										_placeholder={{ color: 'inherit' }}
										className="my-2"
										colorScheme="red"
										color={'gray'}
										isChecked={checkedDeleteStock}
										onChange={(e) => {
											setCheckedDeleteStock(e.target.checked);
										}}
									>
										<p className="text-gray text-sm">Delete all product stock</p>
									</Checkbox>
								)}
							</FormControl>
						)}
					</ModalBody>

					<ModalFooter>
						<Button
							size="sm"
							colorScheme={checkedDeleteStock ? 'red' : 'teal'}
							mr={3}
							onClick={() => {
								if (
									form.category_id ||
									form.category_name ||
									form.product_name ||
									form.product_price ||
									form.product_image ||
									form.product_description ||
									form.product_usage ||
									form.default_unit ||
									form.product_stock ||
									form.product_netto ||
									form.product_conversion
								) {
									btnEditProduct();
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
							{checkedDeleteStock ? 'Delete & Update' : 'Save changes'}
						</Button>
						<Button
							size="sm"
							onClick={() => {
								if (checkedDeleteStock) {
									setCheckedDeleteStock((prev) => (prev = false));
								} else {
									onCloseEditProduct();
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
