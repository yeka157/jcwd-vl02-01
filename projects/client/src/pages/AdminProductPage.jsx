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
} from '@chakra-ui/react';
import axios from 'axios';
import { API_URL } from '../helper';
import { HiOutlineChevronDown } from 'react-icons/hi';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import AddProductComponent from '../components/AddProductComponent';
import EditProductComponent from '../components/EditProductComponent';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import HeadComponent from '../components/HeadComponent';

export default function AdminProductPage() {
	// HOOKS
	const { isOpen: isOpenDeleteConfirmation, onOpen: onOpenDeleteConfirmation, onClose: onCloseDeleteConfirmation } = useDisclosure();
	const { isOpen: isOpenAddProduct, onOpen: onOpenAddProduct, onClose: onCloseAddProduct } = useDisclosure();
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
	const initialRef = useRef(null);
	const finalRef = useRef(null);
	const id = useId();
	const toast = useToast();
	const navigate = useNavigate();

	// VAR
	const itemsPerPage = 10;
	const token = Cookies.get('sehatToken');

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

	const modalDeleteConfirmation = (
		<Modal className="bg-bgWhite" initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpenDeleteConfirmation} onClose={onCloseDeleteConfirmation} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader fontSize="md">Delete confirmation</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={2}>
					<h1>
						Delete <span className="font-bold">{selectedProduct}</span> from product list?
					</h1>
				</ModalBody>

				<ModalFooter>
					<Button
						borderRadius={0}
						size="sm"
						colorScheme="red"
						mr={3}
						onClick={async () => {
							try {
								let result = await axios.delete(API_URL + '/product/delete_product/' + productData[selectedProductIndex].product_id, {
									headers: {
										Authorization: `Bearer ${token}`,
									},
								});
								if (result.data.success) {
									setCurrentPage((prev) => prev = 1);
									getProductData();
									displayProductData();
									toast({
										size: 'xs',
										title: `${selectedProduct} has been deleted from product list!`,
										position: 'top-right',
										status: 'success',
										isClosable: true,
									});
								}
								onCloseDeleteConfirmation();
							} catch (error) {
								console.log(error);
							}
						}}
					>
						Delete
					</Button>
					<Button borderRadius={0} size="sm" onClick={onCloseDeleteConfirmation}>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);

	const displayProductData = () => {
		const productTable = productData.map((val, idx) => {
			return (
				<Tr key={id + idx}>
					<Td className="text-[rgb(67,67,67)]">{itemsPerPage * (currentPage - 1) + (idx + 1)}.</Td>
					<Td className="text-[rgb(67,67,67)]">{val.product_name}</Td>
					<Td className="text-[rgb(67,67,67)]">Rp{val.product_price.toLocaleString('id')},-</Td>
					<Td className="text-[rgb(67,67,67)]">{val.category_name}</Td>
					<Td className="text-[rgb(67,67,67)]">
						<Button
							size={'xs'}
							colorScheme="blue"
							variant={'outline'}
							className="mr-2"
							style={{ borderRadius: '0' }}
							onClick={() => {
								onOpenProductDetails();
								setSelectedProduct((prev) => (prev = val.product_name));
								setSelectedProductIndex((prev) => (prev = idx));
								getProductStock(val.product_id);
								getProductData();
							}}
						>
							Preview
						</Button>
					</Td>
					<Td>
						<div className="inline">
							<Button
								size={'xs'}
								colorScheme="teal"
								variant={'outline'}
								className="mr-2"
								style={{ borderRadius: '0' }}
								onClick={() => {
									onOpenEditProduct();
									setSelectedProduct((prev) => (prev = val.product_name));
									setSelectedProductIndex((prev) => (prev = idx));
									getProductStock(val.product_id);
									getProductData();
								}}
							>
								Edit
							</Button>
						</div>
						<div className="inline">
							<Button
								size={'xs'}
								colorScheme="red"
								variant={'outline'}
								className="mr-2"
								style={{ borderRadius: '0' }}
								onClick={() => {
									onOpenDeleteConfirmation();
									setSelectedProduct((prev) => (prev = val.product_name));
									setSelectedProductIndex((prev) => (prev = idx));
									getProductStock(val.product_id);
									getProductData();
								}}
							>
								Delete
							</Button>
						</div>
					</Td>
				</Tr>
			);
		});
		return productTable;
	};

	const displayStockData = () => {
		return productStock?.map((val, idx) => {
			if (!val.product_stock) {
				return <h1 key={idx}>Out of stock</h1>;
			}
			if (val.product_conversion_stock) {
				return (
					<div key={idx}>
						<li>
							• {val.product_unit} : {val.product_stock}
						</li>
						<li>
							• {val.product_conversion} : {val.product_conversion_stock}
						</li>
					</div>
				);
			}
			return (
				<li key={idx}>
					{val.product_unit} : {val.product_stock}
				</li>
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
							<img
								className="max-w-[150px]"
								src={
									productData[selectedProductIndex]?.product_image.includes('http')
										? productData[selectedProductIndex]?.product_image
										: `http://localhost:8000/${productData[selectedProductIndex]?.product_image}`
								}
								alt="product_image"
							/>
						</div>
						<h1 className="text-xs font-bold mt-[20px] mb-[5px]">Price</h1>
						<p className="text-xs text-justify">
							Rp{productData[selectedProductIndex]?.product_price.toLocaleString('id')} per {productData[selectedProductIndex]?.default_unit}
						</p>
						<hr className="my-2" />
						<h1 className="text-xs font-bold mt-[10px] mb-[5px]">Description</h1>
						<p className="text-xs text-justify">{productData[selectedProductIndex]?.product_description}</p>
						<hr className="my-2" />
						<h1 className="text-xs font-bold mt-[10px] mb-[5px]">Usage</h1>
						<p className="text-xs text-justify">{productData[selectedProductIndex]?.product_usage}</p>
						<hr className="my-2" />
						<h1 className="text-xs font-bold mt-[10px] mb-[5px]">Category</h1>
						<p className="text-xs text-justify">{productData[selectedProductIndex]?.category_name}</p>
						<hr className="my-2" />
						<h1 className="text-xs font-bold mt-[10px] mb-[5px]">Default Unit</h1>
						<p className="text-xs text-justify">{productData[selectedProductIndex]?.default_unit}</p>
						<hr className="my-2" />
						{productStock[0]?.product_conversion && productStock[0]?.product_conversion !== '-' && (
							<>
								<h1 className="text-xs font-bold mt-[10px] mb-[5px]">Conversion Unit</h1>
								<p className="text-xs text-justify">
									{productStock[0]?.product_netto} {productStock[0]?.product_conversion} per {productData[selectedProductIndex]?.default_unit}
								</p>
								<hr className="my-2" />
							</>
						)}
						<h1 className="text-xs font-bold mt-[10px] mb-[5px]">Stock</h1>
						{/* <ol className="text-xs text-justify">{displayStockData()}</ol> */}
						<ol className="text-xs text-justify">{productStock?.length > 0 ? displayStockData() : 'Out of stock'}</ol>
					</div>
				</ModalBody>

				<ModalFooter>
					<Button size="sm" onClick={onCloseProductDetails}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);

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
		<>
			<HeadComponent title={'SEHATBOS | Admin Product'} description={'Admin Product'} type={'website'}/>
			<main className="bg-bgWhite min-h-screen py-5 px-5 lg:px-[10vw]">
				{modalDeleteConfirmation}
				{modalProductDetails}

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
					<h1
						className="font-bold text-lg text-hijauBtn text-center cursor-pointer"
						onClick={() => {
							navigate('/admin');
						}}
					>
						SEHATBOS.COM <span className="font-normal">| PRODUCT</span>
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
					<Button borderRadius={'0'} bgColor="#025d67" color="#f0f5f6" variant="solid" size={'sm'} _hover={{ bg: '#1F6C75' }} onClick={onOpenAddProduct}>
						+ add
					</Button>
				</div>

				<SearchBar filters={filters} setFilters={setFilters} inputValue={filters.product_name} setCurrentPage={setCurrentPage} getProductData={getProductData} />

				<div className={`container mx-auto lg:mt-[-45px] text-[rgb(49,53,65,0.75)] lg:grid justify-items-end`}>
					<div>
						<Menu>
							<MenuButton className="mr-3 text-gray" style={{ borderRadius: 0, border: '1px solid gray' }} as={Button} rightIcon={<HiOutlineChevronDown />} size={'sm'}>
								{filters.category_name === '' ? 'Category' : filters.category_name}
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
						<h1 className="inline">Product</h1>
					</Box>
				</div>
				<div className="flex container mx-auto bg-[rgb(2,93,103,0.1)] mb-[2.5vh]">
					<TableContainer w="100vw" fontSize={'xs'}>
						<Table size="sm">
							<Thead>
								<Tr>
									<Th>No.</Th>
									<Th>Name</Th>
									<Th>Price</Th>
									<Th>Category</Th>
									<Th>Preview</Th>
									<Th>Action</Th>
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
		</>
	);
}
