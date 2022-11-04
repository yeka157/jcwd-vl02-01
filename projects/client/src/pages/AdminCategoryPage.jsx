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
	Tooltip,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	FormControl,
	Input,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import axios from 'axios';
import { API_URL } from '../helper';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import HeadComponent from '../components/HeadComponent';

export default function AdminCategoryPage() {
	// HOOKS
	const { isOpen: isOpenAddCategory, onOpen: onOpenAddCategory, onClose: onCloseAddCategory } = useDisclosure();
	const { isOpen: isOpenEditCategory, onOpen: onOpenEditCategory, onClose: onCloseEditCategory } = useDisclosure();
	const { isOpen: isOpenDeleteConfirmation, onOpen: onOpenDeleteConfirmation, onClose: onCloseDeleteConfirmation } = useDisclosure();
	const [inputCategory, setInputCategory] = useState('');
	const [categoryData, setCategoryData] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(-1);
	const [newCategory, setNewCategory] = useState('')
	const initialRef = useRef(null);
	const finalRef = useRef(null);
	const id = useId();
	const toast = useToast();
	const navigate = useNavigate();

	// VAR
	const token = Cookies.get('sehatToken');

	const getCategoryData = async () => {
		try {
			const result = await axios.get(API_URL + '/category');
			setCategoryData((prev) => (prev = result.data.category));
		} catch (error) {
			console.log(error);
		}
	};

	const btnAddCategory = async (inputCategory) => {
		try {
			const category_name = inputCategory;
			const result = await axios.post(API_URL + '/category/add_category', { category_name }, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (result.data.success) {
				setInputCategory((prev) => (prev = ''));
				toast({
					size: 'xs',
					title: 'New category has been added!',
					position: 'top-right',
					status: 'success',
					isClosable: true,
				});
			} else {
				setInputCategory((prev) => (prev = ''));
				toast({
					size: 'xs',
					title: 'Category already exists!',
					position: 'top-right',
					status: 'success',
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				size: 'xs',
				title: 'Category already exists!',
				position: 'top-right',
				status: 'error',
				isClosable: true,
			});
			console.log(error);
		}
	};

	const btnEditCategory = async (category_id, new_category) => {
		let result = await axios.patch(API_URL + '/category/edit_category/' + category_id, { new_category }, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (result.data.success) {
			getCategoryData();
			displayCategoryData();
			toast({
				size: 'xs',
				title: `"${selectedCategory}" has been updated to "${newCategory}"!`,
				position: 'top-right',
				status: 'success',
				isClosable: true,
			});
		}
	};

	const btnDeleteCategory = async (category_id) => {
		let result = await axios.delete(API_URL + '/category/delete_category/' + category_id, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (result.data.success) {
			getCategoryData();
			displayCategoryData();
			toast({
				size: 'xs',
				title: `"${selectedCategory}" has been deleted from category list!`,
				position: 'top-right',
				status: 'success',
				isClosable: true,
			});
		}
	};

	const displayCategoryData = () => {
		const categoryTable = categoryData.map((val, idx) => {
			return (
				<Tr key={id + idx}>
					<Td className="text-[rgb(67,67,67)]">{idx + 1}.</Td>
					<Td className="text-[rgb(67,67,67)]">{val.category_name}</Td>
					<Td className='flex justify-end'>
						<div className="inline">
							<Button
								size={'xs'}
								colorScheme="teal"
								variant={'outline'}
								className="mr-2"
								style={{ borderRadius: '0' }}
								onClick={() => {
									onOpenEditCategory();
									setSelectedCategory(prev => prev = val.category_name);
									setSelectedCategoryIndex(prev => prev = val.category_id);
									getCategoryData();
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
									setSelectedCategory(prev => prev = val.category_name);
									setSelectedCategoryIndex(prev => prev = val.category_id);
									getCategoryData();
								}}
							>
								Delete
							</Button>
						</div>
					</Td>
				</Tr>
			);
		});
		return categoryTable;
	};

	useEffect(() => {
		getCategoryData();
		// displayCategoryData()
	}, [inputCategory]);

	const modalAddCategory = (
		<div>
			<Modal className="bg-bgWhite" initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpenAddCategory} onClose={onCloseAddCategory} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontSize="md">Add new category</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={2}>
						<FormControl>
							<Input
								value={inputCategory}
								className="text-borderHijau"
								borderRadius="md"
								size="sm"
								ref={initialRef}
								placeholder="Category name"
								_focusVisible={{ outline: '2px solid #1F6C75' }}
								_placeholder={{ color: 'inherit' }}
								color="gray"
								onChange={(e) => setInputCategory((prev) => (prev = e.target.value))}
							/>
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button
							size="sm"
							colorScheme="teal"
							mr={3}
							onClick={() => {
								btnAddCategory(inputCategory);
								onCloseAddCategory();
							}}
						>
							Save
						</Button>
						<Button size="sm" onClick={onCloseAddCategory}>
							Cancel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);

	const modalEditCategory = (
		<Modal className="bg-bgWhite" initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpenEditCategory} onClose={onCloseEditCategory} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader fontSize="md">Edit category</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={2}>
					<FormControl>
						<Input
							borderRadius={0}
							className="text-borderHijau"
							size="sm"
							ref={initialRef}
							placeholder={selectedCategory}
							_focusVisible={{ outline: '2px solid #1F6C75' }}
							_placeholder={{ color: 'inherit' }}
							color="gray"
							onChange={(e) => setNewCategory((prev) => (prev = e.target.value))}
						/>
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<Button
						borderRadius={0}
						size="sm"
						colorScheme="teal"
						mr={3}
						onClick={() => {
							btnEditCategory(selectedCategoryIndex, newCategory)
							onCloseEditCategory();
						}}
					>
						Save
					</Button>
					<Button borderRadius={0} size="sm" onClick={onCloseEditCategory}>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);

	const modalDeleteConfirmation = (
		<Modal className="bg-bgWhite" initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpenDeleteConfirmation} onClose={onCloseDeleteConfirmation} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader fontSize="md">Delete confirmation</ModalHeader>
				<ModalCloseButton />
				<ModalBody pb={2}>
					<h1>Delete <span className='font-bold'>{selectedCategory}</span> from category list?</h1>
				</ModalBody>

				<ModalFooter>
					<Button
						borderRadius={0}
						size="sm"
						colorScheme="red"
						mr={3}
						onClick={() => {
							btnDeleteCategory(selectedCategoryIndex);
							onCloseDeleteConfirmation();
						}}
					>
						Delete
					</Button>
					<Button 
						borderRadius={0}
						size="sm" 
						onClick={onCloseDeleteConfirmation}
					>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);

	return (
		<>
			<HeadComponent title={'SEHATBOS | Admin Category'} description={'Admin Category'} type={'website'}/>
			<main className="bg-bgWhite min-h-screen py-5 px-5 lg:px-[10vw]">
				<div className="container mx-auto mt-[2.5vh]">
					<h1 className="font-bold text-lg text-hijauBtn text-center cursor-pointer" onClick={() => { navigate('/admin') }}>
						SEHATBOS.COM <span className="font-normal">| CATEGORY</span>
					</h1>
				</div>

				<div className="container mx-auto mt-[5vh] grid justify-items-start">
					<h1 className="font-bold text-lg">Category List</h1>
					<Breadcrumb fontSize="xs" className="text-[rgb(49,53,65,0.75)]">
						<BreadcrumbItem>
							<BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbItem>
							<BreadcrumbLink>Category</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>
				</div>
				<div className="container mx-auto mt-[-35px] text-[rgb(49,53,65,0.75)] grid justify-items-end">
					<Button borderRadius={'0'} bgColor="#025d67" color="#f0f5f6" variant="solid" size={'sm'} _hover={{ bg: '#1F6C75' }} onClick={onOpenAddCategory}>
						+ add
					</Button>
				</div>
				{modalAddCategory}
				{modalEditCategory}
				{modalDeleteConfirmation}
				<div className="flex container mx-auto mt-[2.5vh] justify-center content-center">
					<Box w="100vw" borderWidth="1px" overflow="hidden" fontWeight="semibold" lineHeight="tight" className="py-[5px] border-borderHijau text-center bg-hijauBtn text-bgWhite">
						<h1 className="inline">Category</h1>
					</Box>
				</div>
				<div className="flex container mx-auto bg-[rgb(2,93,103,0.1)]">
					<TableContainer w="100vw" fontSize={'sm'}>
						<Table size="sm">
							<Thead>
								<Tr>
									<Th>No.</Th>
									<Th>Category Name</Th>
									<Th className='flex justify-end mr-10'>Action</Th>
								</Tr>
							</Thead>
							<Tbody>{displayCategoryData()}</Tbody>
						</Table>
					</TableContainer>
				</div>
			</main>
		</>
	);
}
