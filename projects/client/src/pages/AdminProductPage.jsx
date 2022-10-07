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
} from '@chakra-ui/react';
import axios from 'axios';
import { API_URL } from '../helper';
import { MdOutlinePreview } from 'react-icons/md';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { AiFillEdit } from 'react-icons/ai';
import Pagination from '../components/Pagination';
import { useNavigate, useParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

export default function AdminProductPage() {
	// HOOKS
	const { isOpen: isOpenAddCategory, onOpen: onOpenAddCategory, onClose: onCloseAddCategory } = useDisclosure();
	const { isOpen: isOpenProductDetails, onOpen: onOpenProductDetails, onClose: onCloseProductDetails } = useDisclosure();
	const [productData, setProductData] = useState([]);
	const [categoryData, setCategoryData] = useState([]);
	const [productStock, setProductStock] = useState([]);
	const [totalData, setTotalData] = useState(0);
	const [selectedProductIndex, setSelectedProductIndex] = useState(-1);
	const [filters, setFilters] = useState({ product_name: '', category_name: '', sort: '', order: '' });
	const [currentPage, setCurrentPage] = useState(1);

	const initialRef = useRef(null);
	const finalRef = useRef(null);

	const id = useId();

	const params = useParams();
	const navigate = useNavigate();

	// VAR
	const itemsPerPage = 10;

	// const getProductData = async () => {
	// 	try {
	// 		const result = await axios.get(`${API_URL}/product?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage - 1)}`);
	// 		setProductData((prev) => (prev = result.data.products));
	// 		getTotalData();
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

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
				setProductData((prev) => (prev = result.data.products));
				getTotalData();
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
				setProductData((prev) => (prev = result.data.products));
				return;
			}

			const result = await axios.get(`${API_URL}/product?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage - 1)}`);
			setProductData((prev) => (prev = result.data.products));
			getTotalData();

		} catch (error) {
			setProductData((prev) => (prev = []));
			console.log(error);
		}
	};

	const getTotalData = async () => {
		const totalData = await axios(`${API_URL}/product/count`);
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
						<MdOutlinePreview size={15} className="inline mr-2" />
						<h1
							className="inline underline cursor-pointer text-xs"
							onClick={() => {
								onOpenProductDetails();
								setSelectedProductIndex((prev) => (prev = idx));
								getProductStock(val.product_id);
								getProductData();
							}}
						>
							details
						</h1>
					</Td>
					<Td className="text-[rgb(67,67,67)]">
						<AiFillEdit size={15} className="inline mr-2" />
						<h1
							className="inline underline cursor-pointer text-xs"
							onClick={() => {
								onOpenProductDetails();
								setSelectedProductIndex((prev) => (prev = idx));
								getProductData();
							}}
						>
							edit
						</h1>
					</Td>
				</Tr>
			);
		});
		return productTable;
	};

	const displayStockData = () => {
		return productStock.map((val) => {
			return (
				<ul>
					<li>
						- {val.product_unit} : {val.product_stock}
					</li>
				</ul>
			);
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

	const modalProductDetails = (
		<Modal isCentered size={'xl'} className="bg-bgWhite" initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpenProductDetails} onClose={onCloseProductDetails}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader fontSize="md" className="text-center font-bold">
					{productData[selectedProductIndex]?.product_name}
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={2}>
					<div className="px-[20px]">
						<div className="justify-center items-center flex mt-2">
							<img className="max-w-[150px]" src={productData[selectedProductIndex]?.product_image} alt="" />
						</div>
						<h1 className="text-xs font-bold mt-[20px] mb-[5px]">Price</h1>
						<p className="text-xs text-justify">
							Rp. {productData[selectedProductIndex]?.product_price.toLocaleString('id')} / {productData[selectedProductIndex]?.default_unit}
						</p>
						<h1 className="text-xs font-bold mt-[10px] mb-[5px]">Description</h1>
						<p className="text-xs text-justify">{productData[selectedProductIndex]?.product_description}</p>
						<h1 className="text-xs font-bold mt-[10px] mb-[5px]">Category</h1>
						<p className="text-xs text-justify">{productData[selectedProductIndex]?.category_name}</p>
						<h1 className="text-xs font-bold mt-[10px] mb-[5px]">Default Unit</h1>
						<p className="text-xs text-justify">{productData[selectedProductIndex]?.default_unit}</p>
						<h1 className="text-xs font-bold mt-[10px] mb-[5px]">Stock</h1>
						<p className="text-xs text-justify">{productStock.length > 0 ? displayStockData() : 'Kosong'}</p>
					</div>
				</ModalBody>

				<ModalFooter>
					{/* <Button
						size="sm"
						colorScheme="teal"
						mr={3}
						onClick={() => {
							onCloseProductDetails();
							console.log(productStock);
						}}
					>
						Save
					</Button> */}
					<Button size="sm" onClick={onCloseProductDetails}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);

	const resetFilter = () => {
		setFilters((prev) => (prev = { product_name: '', category_name: '', sort: '', order: '' }));
		setCurrentPage(prev => prev = 1)
	};

	useEffect(() => {
		getProductData();
		getTotalData();
		getCategoryData();
	}, [currentPage]);

	useEffect(() => {
		setTotalData((prev) => (prev = productData.length));
	}, [productData]);

	useEffect(() => {
		if (!filters.category_name && !filters.product_name && !filters.sort && !filters.order) {
			getProductData();
			getTotalData();
			getCategoryData();
		}
	}, [filters]);

	return (
		<main className="bg-bgWhite min-h-screen py-5 px-5 lg:px-[10vw]">
			{modalProductDetails}
			<div className="container mx-auto mt-[2.5vh]">
				<h1 className="font-bold text-lg text-hijauBtn text-center">
					SEHATBOS.COM <span className="font-normal">| DASHBOARD</span>
				</h1>
			</div>

			<div className="container mx-auto mt-[5vh] grid justify-items-start">
				<h1 className="font-bold text-lg">Product List</h1>
				<Breadcrumb fontSize="xs" className="text-[rgb(49,53,65,0.75)]">
					<BreadcrumbItem>
						<BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
					</BreadcrumbItem>

					<BreadcrumbItem>
						<BreadcrumbLink>Product</BreadcrumbLink>
					</BreadcrumbItem>
				</Breadcrumb>
			</div>
			<div className="container mx-auto mt-[-35px] text-[rgb(49,53,65,0.75)] grid justify-items-end">
				<Button borderRadius={'0'} bgColor="#025d67" color="#f0f5f6" variant="solid" size={'sm'} _hover={{ bg: '#1F6C75' }} onClick={onOpenAddCategory}>
					+ add
				</Button>
			</div>

			<SearchBar filters={filters} setFilters={setFilters} inputValue={filters.product_name} />

			<div className={`container mx-auto lg:mt-[-45px] text-[rgb(49,53,65,0.75)] lg:grid justify-items-end`}>
				<div>
					<Menu>
						<MenuButton className="mr-3 text-borderHijau" style={{ borderRadius: 0, border: '1px solid #025d67' }} as={Button} rightIcon={<HiOutlineChevronDown />} size={'sm'}>
							{filters.category_name === '' ? 'Category' : filters.category_name}
						</MenuButton>
						<MenuList>
							<MenuItem
								className="text-xs"
								onClick={() => {
									setFilters((prev) => ({ ...prev, category_name: '' }));
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
										}}
									>
										{val.category_name}
									</MenuItem>
								);
							})}
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton className="mr-3 text-borderHijau" style={{ borderRadius: 0, border: '1px solid #025d67' }} as={Button} rightIcon={<HiOutlineChevronDown />} size={'sm'}>
							{filters.sort === '' ? 'Sort' : `${filters.sort} (${filters.order})`}
						</MenuButton>
						<MenuList>
							<MenuItem
								className="text-xs"
								onClick={() => {
									setFilters((prev) => ({ ...prev, sort: '', order: '' }));
								}}
							>
								None
							</MenuItem>
							<MenuItem
								className="text-xs"
								onClick={() => {
									setFilters((prev) => ({ ...prev, sort: 'Price', order: 'asc' }));
								}}
							>
								{'Price (Ascending)'}
							</MenuItem>
							<MenuItem
								className="text-xs"
								onClick={() => {
									setFilters((prev) => ({ ...prev, sort: 'Price', order: 'desc' }));
								}}
							>
								{'Price (Descending)'}
							</MenuItem>
							<MenuItem
								className="text-xs"
								onClick={() => {
									setFilters((prev) => ({ ...prev, sort: 'Name', order: 'asc' }));
								}}
							>
								{'Product Name (Ascending)'}
							</MenuItem>
							<MenuItem
								className="text-xs"
								onClick={() => {
									setFilters((prev) => ({ ...prev, sort: 'Name', order: 'desc' }));
								}}
							>
								{'Product Name (Descending)'}
							</MenuItem>
						</MenuList>
					</Menu>
					<Button
						className={
							filters.category_name || filters.product_name || filters.sort || filters.order
								? `mr-3 text-borderHijau border-borderHijau`
								: `mr-3 text-borderHijau border-borderHijau disabled cursor-not-allowed hover:disabled`
						}
						style={{ borderColor: '#025d67' }}
						borderRadius={'0'}
						color="text-gray-500"
						variant="outline"
						size={'sm'}
						onClick={() => {
							if (!filters.category_name && !filters.product_name && filters.sort && filters.order) {
								if (currentPage > 1) {
									setCurrentPage(prev => prev = 1);
								}
							}
							getProductData();
						}}
					>
						Search
					</Button>
					<Button style={{ borderColor: 'gray' }} borderRadius={'0'} color="gray" variant="outline" size={'sm'} onClick={resetFilter}>
						Reset
					</Button>
				</div>
			</div>

			<div className="flex container mx-auto mt-[2.5vh] justify-center content-center">
				<Box w="100vw" borderWidth="1px" overflow="hidden" fontWeight="semibold" as="h6" lineHeight="tight" className="py-[5px] border-borderHijau text-center bg-hijauBtn text-bgWhite">
					<h1 className="inline">Product</h1>
				</Box>
			</div>
			<div className="flex container mx-auto bg-[rgb(2,93,103,0.1)] mb-[2.5vh]">
				<TableContainer w="100vw" fontSize={'sm'}>
					<Table size="sm">
						<Thead>
							<Tr>
								<Th>No.</Th>
								<Th>Name</Th>
								<Th>Price</Th>
								<Th>Category</Th>
								<Th>Preview</Th>
								<Th>Edit Product</Th>
							</Tr>
						</Thead>
						<Tbody>
							{/* DISPLAY DATA */}
							{displayProductData()}
						</Tbody>
					</Table>
				</TableContainer>
			</div>
			<Pagination getProductData={getProductData} totalData={totalData} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
		</main>
	);
}
