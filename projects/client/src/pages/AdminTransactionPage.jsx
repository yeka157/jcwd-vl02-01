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
	FormControl,
	FormLabel,
} from '@chakra-ui/react';
import axios from 'axios';
import { API_URL } from '../helper';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { BsCalendar2Event } from 'react-icons/bs';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function AdminTransactionPage() {
	// HOOKS
	const { isOpen: isOpenSelectDate, onOpen: onOpenSelectDate, onClose: onCloseSelectDate } = useDisclosure();
	const [dateRange, setDateRange] = useState({ from: '', to: '' });
	const [filters, setFilters] = useState({ invoice: '', transaction_status: '', from: '', to: '', sort: '', order: '' });
	const [transactionList, setTransactionList] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalData, setTotalData] = useState(0);
	const [selectedForm, setSelectedForm] = useState('ingredients');
	const initialRef = useRef(null);
	const finalRef = useRef(null);
	const id = useId();
	const toast = useToast();
	const navigate = useNavigate();

	// VAR
	const itemsPerPage = 10;
	const transactionStatus = ['Awaiting Admin Confirmation', 'Awaiting Payment', 'Awaiting Payment Confirmation', 'Processed', 'Cancelled', 'Shipped', 'Order Confirmed'];

	const resetFilter = () => {
		setFilters((prev) => (prev = { invoice: '', transaction_status: '', from: '', to: '', sort: '', order: '' }));
		setDateRange((prev) => (prev = { from: '', to: '' }));
		setCurrentPage((prev) => (prev = 1));
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
			const token = Cookies.get('sehatToken');

			const totalData = await axios.get(`${API_URL}/transaction/count`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setTotalData((prev) => (prev = totalData.data.total_data));
		} catch (error) {}
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

	const modalInputPrescription = (
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

					<Box className="border !border-gray-300 h-[100px] mb-2 overflow-y-scroll">
						<Table>
							<Tbody>
								<Tr>
									<Td>
										<h1 className="text-xs ml-2">1. Zendalat 50 mg - 2 Tablet </h1>
									</Td>
								</Tr>
								<Tr>
									<Td>
										<h1 className="text-xs ml-2">1. Zendalat 50 mg - 2 Tablet </h1>
									</Td>
								</Tr>
								<Tr>
									<Td>
										<h1 className="text-xs ml-2">1. Zendalat 50 mg - 2 Tablet </h1>
									</Td>
								</Tr>
								<Tr>
									<Td>
										<h1 className="text-xs ml-2">1. Zendalat 50 mg - 2 Tablet </h1>
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

	const modalSelectDate = (
		<Modal isCentered size={'sm'} className="bg-bgWhite" initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpenSelectDate} onClose={onCloseSelectDate}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Search by date range</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<div className="flex justify-center">
						<div className="mx-1">
							<FormControl>
								<FormLabel>From :</FormLabel>
								<Input
									required
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
					<Button colorScheme="teal" onClick={btnSubmitDateRange}>
						Apply
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);

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

			<div className="container mx-auto mt-[2.5vh]">
				<h1
					className="font-bold text-lg text-hijauBtn text-center cursor-pointer"
					onClick={() => {
						navigate('/admin');
					}}
				>
					SEHATBOS.COM <span className="font-normal">| TRANSACTION</span>
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
										key={idx}
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

					<Button className="mr-3" style={{ borderColor: 'gray' }} borderRadius={'0'} color="gray" variant="outline" size={'sm'} onClick={onOpenSelectDate}>
						{filters.from ? new Date(filters.from).toLocaleDateString('id') + ' - ' + new Date(filters.to).toLocaleDateString('id') : 'By date range'}
						<BsCalendar2Event className="ml-3" />
					</Button>

					<Button
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
								<Th>Invoice</Th>
								<Th>Total Purchase</Th>
								<Th>Status</Th>
								<Th>Action</Th>
							</Tr>
						</Thead>
						<Tbody>
							{transactionList?.map((val, idx) => {
								return (
									<Tr key={idx}>
										<Td className="text-[rgb(67,67,67)]">{idx + 1}</Td>
										<Td className="text-[rgb(67,67,67)]">{new Date(val.order_date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Td>
										<Td className="text-[rgb(67,67,67)]">{val.invoice}</Td>
										<Td className="text-[rgb(67,67,67)]"> {val.total_purchase ? 'Rp' + val.total_purchase?.toLocaleString('id') + ',-' : '-'}</Td>
										<Td className="text-[rgb(67,67,67)]">
											<Badge
												colorScheme={
													val.transaction_status === 'Cancelled'
														? 'red'
														: val.transaction_status === 'Awaiting Admin Confirmation'
														? 'purple'
														: val.transaction_status === 'Awaiting Payment'
														? 'blue'
														: 'green'
												}
											>
												{val.transaction_status}
											</Badge>
										</Td>
										<Td className="text-[rgb(67,67,67)]">Action</Td>
									</Tr>
								);
							})}
						</Tbody>
					</Table>
				</TableContainer>
			</div>
			<Pagination getProductData={getTransactions} totalData={totalData} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
		</main>
	);
}
