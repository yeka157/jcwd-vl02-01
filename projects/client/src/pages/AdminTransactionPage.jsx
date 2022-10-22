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
import axios from 'axios';
import { API_URL } from '../helper';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { BsCalendar2Event } from 'react-icons/bs';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function AdminTransactionPage() {
	// HOOKS
	const { isOpen: isOpenSelectDate, onOpen: onOpenSelectDate, onClose: onCloseSelectDate } = useDisclosure();
	const { isOpen: isOpenModalAction, onOpen: onOpenModalAction, onClose: onCloseModalAction } = useDisclosure();
	const [dateRange, setDateRange] = useState({ from: '', to: '' });
	const [filters, setFilters] = useState({ invoice: '', transaction_status: '', from: '', to: '', sort: '', order: '' });
	const [transactionList, setTransactionList] = useState([]);
	const [productInputList, setProductInputList] = useState([]);
	const [productStock, setProductStock] = useState([]);
	const [productName, setProductName] = useState('');
	const [ingredients, setIngredients] = useState({ product_name: '', quantity: 0, product_unit: '', isConversion: false });
	const [ingredientsList, setIngredientsList] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedTransaction, setSelectedTransaction] = useState({});
	const [selectedTransactionIndex, setSelectedTransactionIndex] = useState({});
	const [totalData, setTotalData] = useState(0);
	const initialRef = useRef(null);
	const finalRef = useRef(null);
	const id = useId();
	const toast = useToast();
	const navigate = useNavigate();

	// VAR
	const itemsPerPage = 10;
	const transactionStatus = ['Awaiting Admin Confirmation', 'Awaiting Payment', 'Awaiting Payment Confirmation', 'Processed', 'Cancelled', 'Shipped', 'Order Confirmed'];
	const whiteListedStatus = ['Awaiting Admin Confirmation', 'Awaiting Payment Confirmation'];
	const whiteListedCancelStatus = ['Awaiting Admin Confirmation', 'Awaiting Payment', 'Awaiting Payment Confirmation', 'Processed'];
	const token = Cookies.get('sehatToken');

	const resetFilter = () => {
		setFilters((prev) => (prev = { invoice: '', transaction_status: '', from: '', to: '', sort: '', order: '' }));
		setDateRange((prev) => (prev = { from: '', to: '' }));
		setCurrentPage((prev) => (prev = 1));
	};

	const isProductInserted = () => {
		let index = ingredientsList?.findIndex((val) => val.ingredients?.product_name === productInputList[0]?.product_name);
		if (index > -1) {
			return true;
		}
		return false;
	};

	const btnSubmitDateRange = () => {
		if (!dateRange.from || !dateRange.to) {
			console.log('wrong format');
		} else {
			setFilters((prev) => (prev = { ...prev, from: dateRange.from, to: dateRange.to }));
			onCloseSelectDate();
		}
	};

	const getTotalData = async () => {
		try {
			const totalData = await axios.get(`${API_URL}/transaction/count`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setTotalData((prev) => (prev = totalData.data.total_data));
		} catch (error) {}
	};

	const badgeColor = (transaction_status) => {
		switch (transaction_status) {
			case 'Awaiting Admin Confirmation':
				return 'purple';
				break;
			case 'Awaiting Payment':
				return 'blue';
				break;
			case 'Awaiting Payment Confirmation':
				return 'purple';
				break;
			case 'Processed':
				return 'blue';
				break;
			case 'Cancelled':
				return 'red';
				break;
			case 'Shipped ':
				return 'blue';
				break;
			case 'Order Confirmed':
				return 'green';
				break;
			default:
				break;
		}
	};

	const getTransactions = async () => {
		try {
			const token = Cookies.get('sehatToken');

			if (!filters.invoice && !filters.transaction_status && !filters.to && filters.from && filters.sort && filters.order) {
				let temp = [];
				for (let filter in filters) {
					if (filters[filter] !== '') {
						temp.push(`${filter}=${filters[filter]}`);
					}
				}

				const result = await axios.get(API_URL + `/transaction/get_transaction?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage - 1)}&${temp.join('&')}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setTransactionList((prev) => (prev = result.data.transactions));
				return;
			}

			if (filters.invoice || filters.transaction_status || filters.to || filters.from || filters.sort || filters.order) {
				let temp = [];
				for (let filter in filters) {
					if (filters[filter] !== '') {
						temp.push(`${filter}=${filters[filter]}`);
					}
				}

				const result = await axios.get(API_URL + `/transaction/get_transaction?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage - 1)}&${temp.join('&')}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (result.data.success) {
					setTransactionList((prev) => (prev = result.data.transactions));
				}

				return;
			}

			const result = await axios.get(API_URL + `/transaction/get_transaction?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage - 1)}&sort=Date&order=desc`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setTransactionList((prev) => (prev = result.data.transactions));
		} catch (error) {
			console.log(error);
		}
	};

	const maxStockAvailable = (unit) => {
		let conversionUnit = ['Tablet', 'Kapsul', 'Milliliter'];
		if (!conversionUnit.includes(unit)) {
			return productStock[0]?.product_stock;
		}
		return productStock[0]?.product_conversion_stock + productStock[0]?.product_netto * productStock[0]?.product_stock;
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

	const countTotalPurchase = () => {
		let totalPurchase = 0;
		if (ingredientsList?.length === 0) {
			return;
		}

		ingredientsList?.forEach((val, idx) => {
			if (val.productDetails?.default_unit === val.ingredients?.product_unit) {
				totalPurchase += val.productDetails?.product_price * val.ingredients?.quantity;
				return;
			}
			totalPurchase += (val.productDetails?.product_price / val.productStock?.product_netto) * val.ingredients?.quantity;
		});
		return totalPurchase;
	};

	const displayIngredients = () => {
		return ingredientsList?.map((val, idx) => {
			countTotalPurchase();
			return (
				<Tr key={Math.random() + id}>
					<Td>
						<h1 className="text-xs ml-2">
							{`${idx + 1}. ${val.ingredients?.product_name} 
						${
							val.productDetails?.default_unit === val.ingredients?.product_unit
								? '@Rp' + val.productDetails.product_price?.toLocaleString('id') + ',-'
								: '(c) @Rp' + (val.productDetails?.product_price / val.productStock?.product_netto).toLocaleString('id') + ',-'
						}
						x ${val.ingredients?.quantity} ${val.ingredients?.product_unit} 
						= Rp${
							val.productDetails?.default_unit === val.ingredients?.product_unit
								? (val.productDetails?.product_price * val.ingredients?.quantity).toLocaleString('id') + ',-'
								: ((val.productDetails?.product_price / val.productStock?.product_netto) * val.ingredients?.quantity).toLocaleString('id') + ',-'
						}`}
						</h1>
					</Td>
				</Tr>
			);
		});
	};

	const inputPrescription = (
		<>
			<Box className="border !border-b-0 !border-gray-300 container flex justify-center py-5">
				<a href={`http://localhost:8000${selectedTransaction?.doctor_prescription}`} target="_blank">
					<img className="min-w-[250px] max-w-[450px]" src={`http://localhost:8000/${selectedTransaction?.doctor_prescription}`} alt="doctor_prescription" />
				</a>
			</Box>
			<Box className="border !border-b-0 !border-gray-300 container flex justify-center">
				<h1 className={`text-sm text-center font-semibold text-borderHijau my-1`}>INGREDIENTS</h1>
			</Box>
			<Box className="border !border-gray-300 h-[100px] overflow-y-scroll">
				<hr />
				<Table>
					<Tbody>
						{/* ITEMS */}
						{displayIngredients()}
					</Tbody>
				</Table>
			</Box>

			<Box className="border !border-t-0 !border-gray-300 container py-2">
				<h1 className={`text-xs font-bold text-gray-500 text-center mr-3`}>Total Purchase: Rp{countTotalPurchase() ? countTotalPurchase()?.toLocaleString('id') : 0},-</h1>
			</Box>

			<div className="flex">
				<Input
					value={productName}
					className="mt-2 inline w-[80%] mr-3"
					borderRadius="0"
					size="sm"
					ref={initialRef}
					placeholder={'Search Product'}
					_focusVisible={{ outline: '2px solid #1F6C75' }}
					_placeholder={{ color: 'inherit' }}
					color="gray"
					onChange={async (e) => {
						try {
							if (e.target.value === '') {
								setIngredients((prev) => ({ product_name: '', quantity: 0, product_unit: '' }));
								setProductInputList((prev) => (prev = []));
								setProductName('');
								return;
							}

							setProductName(e.target.value);
							const result = await axios.get(`${API_URL}/product?limit=1&offset=0&product_name=${e.target.value}`);
							if (result.data.success) {
								setProductInputList((prev) => (prev = result.data.products));
								getProductStock(result.data.products[0].product_id);
								setIngredients((prev) => ({
									...prev,
									product_id: result.data.products[0]?.product_id,
									product_name: result.data.products[0]?.product_name,
								}));
							}
						} catch (error) {
							console.log(error);
						}
					}}
				/>
				<Button
					borderRadius={0}
					className="mt-2"
					colorScheme={'gray'}
					size="sm"
					onClick={() => {
						setIngredients((prev) => ({ product_name: '', quantity: 0, product_unit: '' }));
						setProductInputList((prev) => (prev = []));
						setProductName('');
					}}
				>
					Clear
				</Button>
			</div>

			{productInputList.length > 0 && (
				<>
					<hr className="mt-2" />
					<h1 className={`text-red-500 text-xs text-center my-2 ${isProductInserted() || ingredients?.quantity <= maxStockAvailable(ingredients?.product_unit) ? 'hidden' : ''}`}>
						Insufficient stock: {maxStockAvailable(ingredients?.product_unit) + ' ' + ingredients?.product_unit + ' left'}
					</h1>
					<h1 className={`text-red-500 text-xs text-center my-2 ${!isProductInserted() ? 'hidden' : ''}`}>Product is already on the list!</h1>
					<h1 className={`text-gray-500 text-xs text-center my-2 ${isProductInserted() || ingredients?.quantity > maxStockAvailable(ingredients?.product_unit) ? 'hidden' : ''}`}>
						Available stock : {maxStockAvailable(ingredients?.product_unit) + ' ' + ingredients?.product_unit}
					</h1>
					<hr />
				</>
			)}

			{productInputList.length > 0 && (
				<div className="flex">
					<Input
						required
						isDisabled
						className="my-2 inline mr-3 !w-[40%]"
						borderRadius="0"
						size="sm"
						ref={initialRef}
						placeholder={productInputList[0]?.product_name}
						_focusVisible={{ outline: '2px solid #1F6C75' }}
						_placeholder={{ color: 'inherit' }}
						color="black"
					/>

					<Menu>
						<MenuButton
							className="my-2 w-[30%] border-[1px] border-gray text-xs mr-3"
							color={'gray'}
							bgColor={'white'}
							style={{ borderRadius: 0 }}
							as={Button}
							rightIcon={<HiOutlineChevronDown />}
							size={'sm'}
						>
							{ingredients?.product_unit ? ingredients?.product_unit : 'Unit'}
						</MenuButton>
						<MenuList>
							<MenuItem
								className="text-xs"
								color={'gray'}
								onClick={() => {
									setIngredients((prev) => ({ ...prev, product_unit: productStock[0]?.product_unit, isConversion: false }));
									getProductStock(productInputList[0]?.product_id);
								}}
							>
								{productStock[0]?.product_unit}
							</MenuItem>
							<MenuItem
								className="text-xs"
								color={'gray'}
								onClick={() => {
									setIngredients((prev) => ({ ...prev, product_unit: productStock[0]?.product_conversion, isConversion: true }));
									getProductStock(productInputList[0]?.product_id);
								}}
							>
								{productStock[0]?.product_conversion}
							</MenuItem>
						</MenuList>
					</Menu>

					<NumberInput
						placeholder="Stock"
						size="sm"
						min={0}
						className="text-borderHijau my-2 !w-[20%] mr-3"
						_focusVisible={{ outline: `2px solid ${ingredients?.quantity > maxStockAvailable(ingredients?.product_unit) ? '#eb4848' : '#1F6C75'}` }}
						_placeholder={{ color: 'inherit' }}
					>
						<NumberInputField
							placeholder="Stock"
							borderRadius="0"
							color="gray"
							_focusVisible={{ outline: `2px solid ${ingredients?.quantity > maxStockAvailable(ingredients?.product_unit) ? '#eb4848' : '#1F6C75'}` }}
							_placeholder={{ color: 'inherit' }}
							onChange={(e) => {
								setIngredients((prev) => ({ ...prev, quantity: e.target.value }));
							}}
						/>
					</NumberInput>

					<Button
						disabled={ingredients?.quantity > maxStockAvailable(ingredients.product_unit) || ingredients?.quantity === 0 || isProductInserted()}
						borderRadius={0}
						className="my-2"
						colorScheme={'teal'}
						size="sm"
						onClick={() => {
							setIngredientsList(
								(prev) => (prev = [...ingredientsList, { ingredients: ingredients, productDetails: productInputList[0], productStock: productStock[0], transactionDetails: selectedTransaction }])
							);
							// reset input
							setIngredients((prev) => ({ product_name: '', quantity: 0, product_unit: '' }));
							setProductInputList((prev) => (prev = []));
							setProductName('');
						}}
					>
						+
					</Button>
				</div>
			)}
		</>
	);

	const modalWindow = (
		<Modal isCentered size={'2xl'} className="bg-bgWhite" initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpenModalAction} onClose={onCloseModalAction}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader fontSize="lg" className="font-bold text-center">
					{selectedTransaction?.doctor_prescription ? 'DOCTOR PRESCRIPTION ORDER' : 'ORDER'}
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={2}>{selectedTransaction?.doctor_prescription ? inputPrescription : ''}</ModalBody>
				<ModalFooter>
					<Button
						borderRadius={0}
						className="mr-3"
						colorScheme={'teal'}
						size="sm"
						onClick={() => {
							console.log(ingredientsList);
							let promise = [];
							const handleDoctorPrescription = async () => {
								for (let i = 0; i < ingredientsList.length; i++) {
									promise.push(
										await axios.patch(`http://localhost:8000/api/transaction/confirm_prescription/${ingredientsList[i]?.productDetails.product_id}`, ingredientsList[i], {
											headers: {
												Authorization: `Bearer ${token}`,
											},
										})
									);
								}
								await Promise.all(promise);
							};
							const resolvePromise = async () => {
								await handleDoctorPrescription();
								console.log(promise);
							};

							resolvePromise();
							onCloseModalAction();
							let temp = transactionList;
							temp.splice(selectedTransactionIndex, 1, {...selectedTransaction, transaction_status: 'Awaiting Payment'});
							setTransactionList((prev) => prev = temp);
						}}
					>
						Confirm Order
					</Button>
					<Button borderRadius={0} size="sm" onClick={onCloseModalAction}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);

	const modalSelectDate = (
		<Modal isCentered size={'sm'} className="bg-bgWhite" initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpenSelectDate} onClose={onCloseSelectDate}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Search by date range</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<div className="flex justify-center mb-4">
						<div className="mx-1">
							<FormControl>
								<FormLabel>From :</FormLabel>
								<Input
									required
									value={dateRange.from}
									className="text-borderHijau"
									borderRadius="0"
									size="sm"
									ref={initialRef}
									_focusVisible={{ outline: '2px solid #1F6C75' }}
									color="gray"
									type="date"
									min="2020-01-01"
									max="2045-09-29"
									onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
								/>
							</FormControl>
						</div>

						<div className="mx-1">
							<FormControl>
								<FormLabel>To : </FormLabel>
								<Input
									required
									value={dateRange.to}
									className="text-borderHijau"
									borderRadius="0"
									size="sm"
									_focusVisible={{ outline: '2px solid #1F6C75' }}
									color="gray"
									type="date"
									min="2020-01-01"
									max="2045-09-29"
									onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
								/>
							</FormControl>
						</div>
					</div>
				</ModalBody>

				<ModalFooter>
					<Button borderRadius={0} size={'sm'} colorScheme="teal" onClick={btnSubmitDateRange} className="mr-3">
						Apply date
					</Button>
					<Button
						borderRadius={0}
						size={'sm'}
						colorScheme="red"
						onClick={() => {
							setFilters((prev) => ({ ...prev, from: '', to: '' }));
							setDateRange((prev) => (prev = { from: '', to: '' }));
							setCurrentPage((prev) => (prev = 1));
						}}
					>
						Reset date
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);

	useEffect(() => {
		setIngredients((prev) => ({ ...prev, product_name: productInputList[0]?.product_name }));
	}, [productInputList]);

	useEffect(() => {
		if (!isOpenModalAction) {
			setIngredients((prev) => ({ product_name: '', quantity: 0, product_unit: '' }));
			setProductInputList((prev) => (prev = []));
			setProductName('');
			setIngredientsList((prev) => (prev = []));
		}
	}, [isOpenModalAction]);

	useEffect(() => {
		getTransactions();
	}, [currentPage]);

	useEffect(() => {
		if (filters.invoice || filters.transaction_status || filters.from || filters.to) {
			setTotalData((prev) => (prev = transactionList.length));
		}
	}, [transactionList]);

	useEffect(() => {
		if (filters.invoice == '' && filters.transaction_status == '' && filters.from == '' && filters.to == '' && filters.sort == '' && filters.order == '') {
			getTransactions();
			getTotalData();
		}
		getTransactions();
	}, [filters]);

	return (
		<main className="bg-bgWhite min-h-screen py-5 px-5 lg:px-[10vw]">
			{modalSelectDate}
			{modalWindow}

			<div className="container mx-auto mt-[2.5vh]">
				<h1
					className="font-bold text-lg text-hijauBtn text-center cursor-pointer"
					onClick={() => {
						navigate('/admin');
					}}
				>
					SEHATBOS.COM <span className="font-normal">| TRANSACTION HISTORY</span>
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

			<div className="flex">
				<div className="mb-3 xl:w-96">
					<div className="input-group relative flex flex-wrap items-stretch w-full">
						<div className="inline mt-5">
							<input
								style={{ borderRadius: 0 }}
								value={filters.invoice}
								type="search"
								className="form-control relative flex-auto w-[200px] block px-3 py-1.5 text-sm font-normal text-gray-700 bg-bgWhite bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-bgWhite focus:border-borderHijau focus:outline-none"
								placeholder={'Search by Invoice ID'}
								aria-label="Search"
								aria-describedby="button-addon3"
								onChange={(e) => {
									setCurrentPage((prev) => (prev = 1));
									setFilters((prev) => ({ ...prev, invoice: e.target.value }));
								}}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className={`container mx-auto lg:mt-[-45px] text-[rgb(49,53,65,0.75)] lg:grid justify-items-end`}>
				<div>
					<Menu>
						<MenuButton className="mr-3 text-gray" style={{ borderRadius: 0, border: '1px solid gray' }} as={Button} rightIcon={<HiOutlineChevronDown />} size={'sm'}>
							{filters.transaction_status ? filters.transaction_status : 'Transaction Status'}
						</MenuButton>
						<MenuList>
							<MenuItem
								className="text-xs"
								onClick={() => {
									setFilters((prev) => ({ ...prev, transaction_status: '' }));
									setCurrentPage((prev) => (prev = 1));
								}}
							>
								None
							</MenuItem>
							{transactionStatus.map((val, idx) => {
								return (
									<MenuItem
										key={Math.random() + id}
										className="text-xs"
										onClick={() => {
											setFilters((prev) => ({ ...prev, transaction_status: val }));
											setCurrentPage((prev) => (prev = 1));
										}}
									>
										{val}
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
									setFilters((prev) => ({ ...prev, sort: 'Invoice', order: 'asc' }));
								}}
							>
								{'Invoice Number (Ascending)'}
							</MenuItem>
							<MenuItem
								className="text-xs"
								onClick={() => {
									setCurrentPage((prev) => (prev = 1));
									setFilters((prev) => ({ ...prev, sort: 'Invoice', order: 'desc' }));
								}}
							>
								{'Invoice Number (Descending)'}
							</MenuItem>
							<MenuItem
								className="text-xs"
								onClick={() => {
									setCurrentPage((prev) => (prev = 1));
									setFilters((prev) => ({ ...prev, sort: 'Date', order: 'asc' }));
								}}
							>
								{'Date (Ascending)'}
							</MenuItem>
							<MenuItem
								className="text-xs"
								onClick={() => {
									setCurrentPage((prev) => (prev = 1));
									setFilters((prev) => ({ ...prev, sort: 'Date', order: 'desc' }));
								}}
							>
								{'Date (Descending)'}
							</MenuItem>
						</MenuList>
					</Menu>

					<Button className="mr-3 mt-3 md:mt-0 lg:mt-0" style={{ borderColor: 'gray' }} borderRadius={'0'} color="gray" variant="outline" size={'sm'} onClick={onOpenSelectDate}>
						{filters.from ? new Date(filters.from).toLocaleDateString('id') + ' - ' + new Date(filters.to).toLocaleDateString('id') : 'By date range'}
						<BsCalendar2Event className="ml-3" />
					</Button>

					<Button
						className="mt-3 md:mt-0 lg:mt-0"
						style={{ borderColor: 'gray' }}
						disabled={!filters.invoice && !filters.transaction_status && !filters.from && !filters.to && !filters.sort && !filters.order}
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
								<Th>Invoice ID</Th>
								<Th>Status</Th>
								<Th>Preview</Th>
								<Th>Action</Th>
							</Tr>
						</Thead>
						<Tbody>
							{transactionList.length > 0 &&
								transactionList?.map((val, idx) => {
									return (
										<Tr key={id + idx}>
											<Td className="text-[rgb(67,67,67)]">{idx + 1}</Td>
											<Td className="text-[rgb(67,67,67)]">{new Date(val.order_date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Td>
											<Td className="text-[rgb(67,67,67)]">{val.invoice}</Td>
											{/* <Td className="text-[rgb(67,67,67)]"> {val.total_purchase ? 'Rp' + val.total_purchase?.toLocaleString('id') + ',-' : '-'}</Td> */}
											<Td className="text-[rgb(67,67,67)]">
												<Badge variant={'solid'} colorScheme={badgeColor(val.transaction_status)}>
													{val.transaction_status}
												</Badge>
											</Td>
											<Td className="text-[rgb(67,67,67)]">
												<Button
													size={'xs'}
													colorScheme="blue"
													variant={'outline'}
													className="mr-2"
													style={{ borderRadius: '0' }}
													onClick={() => {
														onOpenModalAction();
													}}
												>
													Preview
												</Button>
											</Td>
											<Td className="text-[rgb(67,67,67)]">
												{whiteListedStatus.includes(val.transaction_status) && (
													<Button
														size={'xs'}
														colorScheme="purple"
														variant={'outline'}
														className={`mr-2`}
														style={{ borderRadius: '0' }}
														onClick={() => {
															onOpenModalAction();
															setSelectedTransaction((prev) => (prev = val));
															setSelectedTransactionIndex(prev => prev = idx)
														}}
													>
														Handle
													</Button>
												)}
												{whiteListedCancelStatus.includes(val.transaction_status) && (
													<Button size={'xs'} colorScheme="red" variant={'outline'} style={{ borderRadius: '0' }}>
														Cancel
													</Button>
												)}
											</Td>
										</Tr>
									);
								})}
						</Tbody>
					</Table>
				</TableContainer>
			</div>
			<div className="mb-5">
				<h1 className="inline mr-2 font-semibold text-sm text-gray-500">Status Color:</h1>
				<Badge variant={'solid'} colorScheme={'purple'} className="mr-2">
					HANDLING
				</Badge>
				<Badge variant={'solid'} colorScheme={'blue'} className="mr-2">
					WAITING
				</Badge>
				<Badge variant={'solid'} colorScheme={'green'} className="mr-2">
					COMPLETED
				</Badge>
				<Badge variant={'solid'} colorScheme={'red'}>
					CANCELLED
				</Badge>
			</div>
			<Pagination getProductData={getTransactions} totalData={totalData} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
		</main>
	);
}
