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
import { MdCategory } from 'react-icons/md';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import axios from 'axios';
import { API_URL } from '../helper';

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

	// VAR

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
			const result = await axios.post(API_URL + '/category/add_category', { category_name });
			if (result.data.success) {
				setInputCategory((prev) => (prev = ''));
			}
		} catch (error) {
			console.log(error);
		}
	};

	const btnEditCategory = async (category_id, new_category) => {
		let result = await axios.patch(API_URL + '/category/edit_category/' + category_id, { new_category });
		if (result.data.success) {
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
		let result = await axios.delete(API_URL + '/category/delete_category/' + category_id);
		if (result.data.success) {
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
					<Td>
						<div className="inline">
							<Tooltip hasArrow label="edit" placement="right" shouldWrapChildren>
								<AiFillEdit size={17} color="rgb(67,67,67,0.8)" className="cursor-pointer" 
									onClick={() => {
										onOpenEditCategory();
										setSelectedCategory(prev => prev = val.category_name);
										setSelectedCategoryIndex(prev => prev = val.category_id);
										getCategoryData();
									}}
								/>
							</Tooltip>
						</div>
						<div className="inline">
							<Tooltip hasArrow label="delete" placement="right" shouldWrapChildren>
								<AiFillDelete size={17} color="rgb(67,67,67,0.8)" className="cursor-pointer ml-5" 
									onClick={() => {
										onOpenDeleteConfirmation();
										setSelectedCategory(prev => prev = val.category_name);
										setSelectedCategoryIndex(prev => prev = val.category_id);
										getCategoryData();
									}} 
								/>
							</Tooltip>
						</div>
					</Td>
				</Tr>
			);
		});
		return categoryTable;
	};

	useEffect(() => {
		getCategoryData();
	}, []);

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
								color="rgb(2,93,103,0.8)"
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
								toast({
									size: 'xs',
									title: 'New category has been added!',
									position: 'top-right',
									// status: 'success',
									isClosable: true,
									render: () => (
										<Box color="white" p={3} bg="green.500">
											<MdCategory className="inline ml-2" />
											<h1 className="inline ml-5 mr-2">New category has been added!</h1>
										</Box>
									),
								});
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
							className="text-borderHijau"
							borderRadius="md"
							size="sm"
							ref={initialRef}
							placeholder={selectedCategory}
							_focusVisible={{ outline: '2px solid #1F6C75' }}
							_placeholder={{ color: 'inherit' }}
							color="rgb(2,93,103,0.7)"
							onChange={(e) => setNewCategory((prev) => (prev = e.target.value))}
						/>
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<Button
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
					<Button size="sm" onClick={onCloseEditCategory}>
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
					<h1>Delete "{selectedCategory}" from category list?</h1>
				</ModalBody>

				<ModalFooter>
					<Button
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
					<Button size="sm" onClick={onCloseDeleteConfirmation}>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);

	return (
		<main className="bg-bgWhite min-h-screen py-5 px-5 lg:px-[10vw]">
			<div className="container mx-auto mt-[2.5vh]">
				<h1 className="font-bold text-lg text-hijauBtn text-center">
					SEHATBOS.COM <span className="font-normal">| DASHBOARD</span>
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
				<Box w="100vw" borderWidth="1px" overflow="hidden" fontWeight="semibold" as="h6" lineHeight="tight" className="py-[5px] border-borderHijau text-center bg-hijauBtn text-bgWhite">
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
								<Th>Action</Th>
							</Tr>
						</Thead>
						<Tbody>{displayCategoryData()}</Tbody>
					</Table>
				</TableContainer>
			</div>
		</main>
	);
}
