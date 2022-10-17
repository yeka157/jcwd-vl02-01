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
	Tooltip,
	useToast,
	Badge,
	Input,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	Checkbox,
} from '@chakra-ui/react';
import axios from 'axios';
import { API_URL } from '../helper';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { BsCalendar2Event } from 'react-icons/bs';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import AddProductComponent from '../components/AddProductComponent';
import EditProductComponent from '../components/EditProductComponent';

export default function AdminTransactionPage() {
	// HOOKS
	const { isOpen: isOpenDeleteConfirmation, onOpen: onOpenDeleteConfirmation, onClose: onCloseDeleteConfirmation } = useDisclosure();
	const { isOpen: isOpenAddProduct, onOpen: onOpenAddProduct, onClose: onCloseAddProduct } = useDisclosure();
	const { isOpen: isOpenSelectDate, onOpen: onOpenSelectDate, onClose: onCloseSelectDate } = useDisclosure();
	const { isOpen: isOpenEditProduct, onOpen: onOpenEditProduct, onClose: onCloseEditProduct } = useDisclosure();
	const { isOpen: isOpenProductDetails, onOpen: onOpenProductDetails, onClose: onCloseProductDetails } = useDisclosure();
	const [productData, setProductData] = useState([]);
	const [categoryData, setCategoryData] = useState([]);
	const [productStock, setProductStock] = useState([]);
	const [totalData, setTotalData] = useState(0);
	const [selectedProduct, setSelectedProduct] = useState('');
	const [selectedProductIndex, setSelectedProductIndex] = useState(-1);
	const [filters, setFilters] = useState({ product_name: '', category_name: '', sort: '', order: '' });
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedForm, setSelectedForm] = useState('ingredients');

	const initialRef = useRef(null);
	const finalRef = useRef(null);

	const id = useId();

	const toast = useToast();

	// VAR
	const itemsPerPage = 10;

	const getProductData = async () => {
		try {
			if (!filters.category_name && !filters.product_name && filters.sort && filters.order) {
				let temp = [];
				for (let filter in filters) {
					if (filters[filter] != '') {
						temp.push(`${filter}=${filters[filter]}`);
					}
				}

				const result = await axios.get(`${API_URL}/product?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage - 1)}&${temp.join('&')}`);
				if (result.data.success) {
					setProductData((prev) => (prev = result.data.products));
					getTotalData();
				}
				return;
			}

			if (filters.category_name || filters.product_name || filters.sort || filters.order) {
				let temp = [];
				for (let filter in filters) {
					if (filters[filter] != '') {
						temp.push(`${filter}=${filters[filter]}`);
					}
				}

				const result = await axios.get(`${API_URL}/product?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage - 1)}&${temp.join('&')}`);
				if (result.data.success) {
					setProductData((prev) => (prev = result.data.products));
				}
				return;
			}

			const result = await axios.get(`${API_URL}/product?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage - 1)}`);
			if (result.data.success) {
				setProductData((prev) => (prev = result.data.products));
				getTotalData();
				return;
			}
		} catch (error) {
			// setProductData((prev) => (prev = []));
			console.log(error);
		}
	};

	const getTotalData = async () => {
		const totalData = await axios.get(`${API_URL}/product/count`);
		setTotalData((prev) => (prev = totalData.data.total_data));
	};

	const getProductStock = async (product_id) => {
		try {
			const result = await axios.get(`${API_URL}/product/stock/${product_id}`);
			if (result.data.success) {
				setProductStock((prev) => (prev = result.data.stock));
				return;
			}
			setProductStock((prev) => (prev = ''));
		} catch (error) {
			console.log(error);
			setProductStock((prev) => (prev = ''));
		}
	};

	const displayProductData = () => {
		const productTable = productData.map((val, idx) => {
			return (
				<Tr key={id + idx}>
					<Td className="text-[rgb(67,67,67)]">{itemsPerPage * (currentPage - 1) + (idx + 1)}.</Td>
					<Td className="text-[rgb(67,67,67)]">{val.product_name}</Td>
					<Td className="text-[rgb(67,67,67)]">Rp {val.product_price.toLocaleString('id')}</Td>
					<Td className="text-[rgb(67,67,67)]">{val.category_name}</Td>
					<Td className="text-[rgb(67,67,67)]">
						<h1
							className="inline text-xs underline cursor-pointer"
							onClick={() => {
								onOpenProductDetails();
								setSelectedProduct((prev) => (prev = val.product_name));
								setSelectedProductIndex((prev) => (prev = idx));
								getProductStock(val.product_id);
								getProductData();
							}}
						>
							see preview
						</h1>
					</Td>
					<Td>
						<div className="inline">
							<Tooltip hasArrow label="edit" placement="right" shouldWrapChildren>
								<AiFillEdit
									size={17}
									color="rgb(67,67,67,0.8)"
									className="cursor-pointer"
									onClick={() => {
										onOpenEditProduct();
										setSelectedProduct((prev) => (prev = val.product_name));
										setSelectedProductIndex((prev) => (prev = idx));
										getProductStock(val.product_id);
										getProductData();
									}}
								/>
							</Tooltip>
						</div>
						<div className="inline">
							<Tooltip hasArrow label="delete" placement="right" shouldWrapChildren>
								<AiFillDelete
									size={17}
									color="rgb(67,67,67,0.8)"
									className="cursor-pointer ml-5"
									onClick={() => {
										onOpenDeleteConfirmation();
										setSelectedProduct((prev) => (prev = val.product_name));
										setSelectedProductIndex((prev) => (prev = idx));
										getProductStock(val.product_id);
										getProductData();
									}}
								/>
							</Tooltip>
						</div>
					</Td>
				</Tr>
			);
		});
		return productTable;
	};

	const displayStockData = () => {
		return productStock?.map((val, idx) => {
			if (val.product_stock) {
				return (
					<li key={idx}>
						{productStock.length > 1 ? '•' : ''} {val.product_unit} : {val.product_stock}
					</li>
				);
			}
			return <h1>Out of stock</h1>;
		});
	};

	const getCategoryData = async () => {
		try {
			const result = await axios.get(API_URL + '/category');
			setCategoryData((prev) => (prev = result.data.category));
		} catch (error) {
			console.log(error);
		}
	};

	// MODAL INPUT PRODUCT PRESCRIPTION
	const modalSelectDate = (
		<Modal isCentered size={'lg'} className="bg-bgWhite" initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpenSelectDate} onClose={onCloseSelectDate}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader fontSize="md" className="font-bold">
					Input Custom Order
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={2}>
					<div className="flex justify-center mb-5">
						<h1
							className={`inline text-sm text-center px-10 pb-2 font-semibold ${selectedForm === 'ingredients' ? 'text-borderHijau border-b-2 border-borderHijau' : 'text-gray-400 cursor-pointer'}`}
							onClick={() => {
								setSelectedForm((prev) => (prev = 'ingredients'));
							}}
						>
							Ingredients
						</h1>
						<h1
							className={`inline text-sm text-center px-10 pb-2 font-semibold ${selectedForm === 'payment' ? 'text-borderHijau border-b-2 border-borderHijau' : 'text-gray-400 cursor-pointer'}`}
							onClick={() => {
								setSelectedForm((prev) => (prev = 'payment'));
							}}
						>
							Details
						</h1>
					</div>

					<Box className='border !border-gray-300 h-[100px] mb-2 overflow-y-scroll'>
						<Table>
							<Tbody>
								<Tr>
									<Td>
										<h1 className='text-xs ml-2'>1. Zendalat 50 mg - 2 Tablet </h1>
									</Td>
								</Tr>
								<Tr>
									<Td>
										<h1 className='text-xs ml-2'>1. Zendalat 50 mg - 2 Tablet </h1>
									</Td>
								</Tr>
								<Tr>
									<Td>
										<h1 className='text-xs ml-2'>1. Zendalat 50 mg - 2 Tablet </h1>
									</Td>
								</Tr>
								<Tr>
									<Td>
										<h1 className='text-xs ml-2'>1. Zendalat 50 mg - 2 Tablet </h1>
									</Td>
								</Tr>
							</Tbody>
						</Table>
					</Box>

					<Input
						required
						className="mt-2 mb-2 inline mr-3"
						borderRadius="0"
						size="sm"
						ref={initialRef}
						placeholder={'Search Product'}
						_focusVisible={{ outline: '2px solid #1F6C75' }}
						_placeholder={{ color: 'inherit' }}
						color="gray"
						onChange={(e) => ''}
					/>

					<div className="flex">
						{/* <Checkbox
              _focusVisible={{ outline: '2px solid #1F6C75' }}
              _placeholder={{ color: 'inherit' }}
              colorScheme="teal"
              color={'gray'}
              className="my-2 mr-3"
              isChecked={false}
              onChange={(e) => ''}
            >
              <p className="text-gray text-sm">
                {productStock[0]?.product_conversion && productStock[0]?.product_conversion !== '-' && productStock[0]?.product_conversion
                  ? 'Edit conversion unit'
                  : 'Create new conversion unit'}
              </p>
            </Checkbox> */}

						<Input
							required
							isDisabled
							className="my-2 inline mr-3 !w-[40%]"
							borderRadius="0"
							size="sm"
							ref={initialRef}
							placeholder={'Product name'}
							_focusVisible={{ outline: '2px solid #1F6C75' }}
							_placeholder={{ color: 'inherit' }}
							color="black"
							onChange={(e) => ''}
						/>

						<NumberInput size="sm" min={0} className="text-borderHijau my-2 !w-[25%] mr-3">
							<NumberInputField borderRadius="0" placeholder={'Stock'} color="gray" _focusVisible={{ outline: '2px solid #1F6C75' }} _placeholder={{ color: 'inherit' }} onChange={(e) => ''} />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>

						<Menu>
							<MenuButton
								className="my-2 w-[35%] border-[1px] border-gray text-xs mr-3"
								color={'gray'}
								bgColor={'white'}
								style={{ borderRadius: 0 }}
								as={Button}
								rightIcon={<HiOutlineChevronDown />}
								size={'sm'}
							>
								{/* {form.category_name ? form.category_name : productData[selectedProductIndex]?.category_name} */}
							</MenuButton>
							<MenuList>
								<MenuItem
									className="text-xs"
									color={'gray'}
									onClick={() => {
										'';
									}}
								>
									Strip
								</MenuItem>

								<MenuItem
									className="text-xs"
									color={'gray'}
									onClick={() => {
										'';
									}}
								>
									Tablet
								</MenuItem>
								{/* {categoryData.map((val, idx) => {
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
                })} */}
							</MenuList>
						</Menu>
						<Button className="my-2" colorScheme={'teal'} size="sm">
							+
						</Button>
					</div>

					<div className="flex">
						{/* <Checkbox
              _focusVisible={{ outline: '2px solid #1F6C75' }}
              _placeholder={{ color: 'inherit' }}
              colorScheme="teal"
              color={'gray'}
              className="my-2 mr-3"
              isChecked={false}
              onChange={(e) => ''}
            >
              <p className="text-gray text-sm">
                {productStock[0]?.product_conversion && productStock[0]?.product_conversion !== '-' && productStock[0]?.product_conversion
                  ? 'Edit conversion unit'
                  : 'Create new conversion unit'}
              </p>
            </Checkbox> */}

						<Input
							required
							isDisabled
							className="my-2 inline mr-3 !w-[40%]"
							borderRadius="0"
							size="sm"
							ref={initialRef}
							placeholder={'Product name'}
							_focusVisible={{ outline: '2px solid #1F6C75' }}
							_placeholder={{ color: 'inherit' }}
							color="black"
							onChange={(e) => ''}
						/>

						<NumberInput size="sm" min={0} className="text-borderHijau my-2 !w-[25%] mr-3">
							<NumberInputField borderRadius="0" placeholder={'Stock'} color="gray" _focusVisible={{ outline: '2px solid #1F6C75' }} _placeholder={{ color: 'inherit' }} onChange={(e) => ''} />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>

						<Menu>
							<MenuButton
								className="my-2 w-[35%] border-[1px] border-gray text-xs mr-3"
								color={'gray'}
								bgColor={'white'}
								style={{ borderRadius: 0 }}
								as={Button}
								rightIcon={<HiOutlineChevronDown />}
								size={'sm'}
							>
								{/* {form.category_name ? form.category_name : productData[selectedProductIndex]?.category_name} */}
							</MenuButton>
							<MenuList>
								<MenuItem
									className="text-xs"
									color={'gray'}
									onClick={() => {
										'';
									}}
								>
									Strip
								</MenuItem>

								<MenuItem
									className="text-xs"
									color={'gray'}
									onClick={() => {
										'';
									}}
								>
									Tablet
								</MenuItem>
								{/* {categoryData.map((val, idx) => {
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
                })} */}
							</MenuList>
						</Menu>
						<Button className="my-2" colorScheme={'teal'} size="sm">
							+
						</Button>
					</div>
				</ModalBody>

				<ModalFooter>
					<Button className="mr-3" colorScheme={'teal'} size="sm" onClick={onCloseSelectDate}>
						Confirm Order
					</Button>
					<Button size="sm" onClick={onCloseSelectDate}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);

	// const modalSelectDate = (
	// 	<Modal isCentered size={'sm'} className="bg-bgWhite" initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpenSelectDate} onClose={onCloseSelectDate}>
	// 		<ModalOverlay />
	// 		<ModalContent>
	// 			<ModalHeader fontSize="md" className="font-bold">
	// 				Filter by date
	// 			</ModalHeader>
	// 			<ModalCloseButton />
	// 			<ModalBody pb={2}>
	// 				<div className="px-[20px]">
	//           <div className='inline'>
	//             <h1 className="font-semibold text-gray text-sm px-2 !border-r-0 my-2"
	//             >
	//               Start Date:
	//             </h1>
	//             <Input
	//               style={{ borderRadius: 0}}
	//               size="sm"
	//               placeholder='start date'
	//               type="date"
	//               _focusVisible={{ outline: 'none' }}
	//               _placeholder={{ color: 'inherit' }}
	//             />

	//             <h1 className="font-semibold text-gray text-sm px-2 !border-r-0 my-2"
	//             >
	//               End Date:
	//             </h1>
	//             <Input
	//               style={{ borderRadius: 0}}
	//               size="sm"
	//               placeholder='start date'
	//               type="date"
	//               _focusVisible={{ outline: 'none' }}
	//               _placeholder={{ color: 'inherit' }}
	//             />
	//             <br className='md:hidden lg:hidden'/>
	//           </div>
	//         </div>
	// 			</ModalBody>

	// 			<ModalFooter>
	// 				<Button className='mr-3' colorScheme={'teal'} size="sm" onClick={onCloseSelectDate}>
	// 					Search
	// 				</Button>
	// 				<Button size="sm" onClick={onCloseSelectDate}>
	// 					Close
	// 				</Button>
	// 			</ModalFooter>
	// 		</ModalContent>
	// 	</Modal>
	// );

	const resetFilter = () => {
		setFilters((prev) => (prev = { product_name: '', category_name: '', sort: '', order: '' }));
		setCurrentPage((prev) => (prev = 1));
		getProductData();
		getTotalData();
	};

	useEffect(() => {
		getProductData();
		getCategoryData();
	}, [currentPage]);

	useEffect(() => {
		if (filters.category_name || filters.product_name) {
			setTotalData((prev) => (prev = productData.length));
		}
	}, [productData]);

	useEffect(() => {
		if (filters.category_name === '' && filters.product_name === '' && filters.sort === '' && filters.order === '') {
			getProductData();
			getTotalData();
		}
		getProductData();
	}, [filters]);

	return (
		<main className="bg-bgWhite min-h-screen py-5 px-5 lg:px-[10vw]">
			{modalSelectDate}

			{/* {initialRef, finalRef, isOpenAddProduct, onCloseAddProduct, onCloseAddProduct} */}
			<AddProductComponent
				totalData={totalData}
				itemsPerPage={itemsPerPage}
				setCurrentPage={setCurrentPage}
				productData={productData}
				getProductData={getProductData}
				categoryData={categoryData}
				initialRef={initialRef}
				finalRef={finalRef}
				isOpenAddProduct={isOpenAddProduct}
				onCloseAddProduct={onCloseAddProduct}
			/>
			<EditProductComponent
				productStock={productStock}
				selectedProductIndex={selectedProductIndex}
				selectedProduct={selectedProduct}
				productData={productData}
				getProductData={getProductData}
				categoryData={categoryData}
				initialRef={initialRef}
				finalRef={finalRef}
				isOpenEditProduct={isOpenEditProduct}
				onCloseEditProduct={onCloseEditProduct}
			/>

			<div className="container mx-auto mt-[2.5vh]">
				<h1 className="font-bold text-lg text-hijauBtn text-center">
					SEHATBOS.COM <span className="font-normal">| DASHBOARD</span>
				</h1>
			</div>

			<div className="container mx-auto mt-[5vh] grid justify-items-start">
				<h1 className="font-bold text-lg">Transaction List</h1>
				<Breadcrumb fontSize="xs" className="text-[rgb(49,53,65,0.75)]">
					<BreadcrumbItem>
						<BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
					</BreadcrumbItem>

					<BreadcrumbItem>
						<BreadcrumbLink>Transaction</BreadcrumbLink>
					</BreadcrumbItem>
				</Breadcrumb>
			</div>

			<SearchBar placeholder={'Search by Invoice ID'} filters={filters} setFilters={setFilters} inputValue={filters.product_name} setCurrentPage={setCurrentPage} getProductData={getProductData} />

			<div className={`container mx-auto lg:mt-[-45px] text-[rgb(49,53,65,0.75)] lg:grid justify-items-end`}>
				<div>
					<Menu>
						<MenuButton className="mr-3 text-gray" style={{ borderRadius: 0, border: '1px solid gray' }} as={Button} rightIcon={<HiOutlineChevronDown />} size={'sm'}>
							{filters.category_name === '' ? 'Order Status' : filters.category_name}
						</MenuButton>
						<MenuList>
							<MenuItem
								className="text-xs"
								onClick={() => {
									setFilters((prev) => ({ ...prev, category_name: '' }));
									setCurrentPage((prev) => (prev = 1));
								}}
							>
								None
							</MenuItem>
							{categoryData.map((val, idx) => {
								return (
									<MenuItem
										key={idx}
										className="text-xs"
										onClick={() => {
											setFilters((prev) => ({ ...prev, category_name: val.category_name }));
											setCurrentPage((prev) => (prev = 1));
										}}
									>
										{val.category_name}
									</MenuItem>
								);
							})}
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton className="mr-3 text-gray" style={{ borderRadius: 0, border: '1px solid gray' }} as={Button} rightIcon={<HiOutlineChevronDown />} size={'sm'}>
							{filters.sort === '' ? 'Sort' : `${filters.sort} (${filters.order})`}
						</MenuButton>
						<MenuList>
							<MenuItem
								className="text-xs"
								onClick={() => {
									setCurrentPage((prev) => (prev = 1));
									setFilters((prev) => ({ ...prev, sort: '', order: '' }));
								}}
							>
								None
							</MenuItem>
							<MenuItem
								className="text-xs"
								onClick={() => {
									setCurrentPage((prev) => (prev = 1));
									setFilters((prev) => ({ ...prev, sort: 'Price', order: 'asc' }));
								}}
							>
								{'Price (Ascending)'}
							</MenuItem>
							<MenuItem
								className="text-xs"
								onClick={() => {
									setCurrentPage((prev) => (prev = 1));
									setFilters((prev) => ({ ...prev, sort: 'Price', order: 'desc' }));
								}}
							>
								{'Price (Descending)'}
							</MenuItem>
							<MenuItem
								className="text-xs"
								onClick={() => {
									setCurrentPage((prev) => (prev = 1));
									setFilters((prev) => ({ ...prev, sort: 'Name', order: 'asc' }));
								}}
							>
								{'Product Name (Ascending)'}
							</MenuItem>
							<MenuItem
								className="text-xs"
								onClick={() => {
									setCurrentPage((prev) => (prev = 1));
									setFilters((prev) => ({ ...prev, sort: 'Name', order: 'desc' }));
								}}
							>
								{'Product Name (Descending)'}
							</MenuItem>
						</MenuList>
					</Menu>

					<Button className="mr-3" style={{ borderColor: 'gray' }} borderRadius={'0'} color="gray" variant="outline" size={'sm'} onClick={onOpenSelectDate}>
						Date
						<BsCalendar2Event className="ml-2" />
					</Button>

					<Button
						style={{ borderColor: 'gray' }}
						disabled={!filters.category_name && !filters.product_name && !filters.sort && !filters.order}
						borderRadius={'0'}
						color="gray"
						variant="outline"
						size={'sm'}
						onClick={resetFilter}
					>
						Reset Filter
					</Button>
				</div>
			</div>

			<div className="flex container mx-auto mt-[2.5vh] justify-center content-center">
				<Box w="100vw" borderWidth="1px" overflow="hidden" fontWeight="semibold" lineHeight="tight" className="py-[5px] border-borderHijau text-center bg-hijauBtn text-bgWhite">
					<h1 className="inline">Transaction</h1>
				</Box>
			</div>
			<div className="flex container mx-auto bg-[rgb(2,93,103,0.1)] mb-[2.5vh]">
				<TableContainer w="100vw" fontSize={'xs'}>
					<Table size="sm">
						<Thead>
							<Tr>
								<Th>No.</Th>
								<Th>Date</Th>
								<Th>Invoice</Th>
								<Th>Total Purchase</Th>
								<Th>Status</Th>
								<Th>Action</Th>
							</Tr>
							<Tr>
								<Td className="text-[rgb(67,67,67)]">1</Td>
								<Td className="text-[rgb(67,67,67)]">01 May 2022</Td>
								<Td className="text-[rgb(67,67,67)]">INV-ABC-123</Td>
								<Td className="text-[rgb(67,67,67)]">Rp 160.000</Td>
								<Td className="text-[rgb(67,67,67)]">
									<Badge colorScheme="green">Dikirim</Badge>
								</Td>
								<Td className="text-[rgb(67,67,67)]">Action</Td>
							</Tr>
							<Tr>
								<Td className="text-[rgb(67,67,67)]">2</Td>
								<Td className="text-[rgb(67,67,67)]">02 May 2022</Td>
								<Td className="text-[rgb(67,67,67)]">INV-ABC-321</Td>
								<Td className="text-[rgb(67,67,67)]">Rp 160.000</Td>
								<Td className="text-[rgb(67,67,67)]">
									<Badge colorScheme="green">Dikirim</Badge>
								</Td>
								<Td className="text-[rgb(67,67,67)]">Action</Td>
							</Tr>
						</Thead>
						<Tbody>
							{/* DISPLAY DATA */}
							{/* {displayProductData()} */}
						</Tbody>
					</Table>
				</TableContainer>
			</div>
			<Pagination getProductData={getProductData} totalData={totalData} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
		</main>
	);
}
