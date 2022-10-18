import React, { useEffect } from "react";
import {
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input
} from "@chakra-ui/react";
import { HiChevronDown } from "react-icons/hi";
import { useState } from "react";
import { TiDelete } from "react-icons/ti";
import { API_URL } from '../helper';
import TransactionListComponent from "../components/TransactionListComponent";
import axios from 'axios';
import Cookies from 'js-cookie';
import { MdDateRange } from "react-icons/md";
import Pagination from '../components/Pagination';


export default function TransactionListPage() {

    const [transactionList, setTransactionList] = useState([]);
    const [filters, setFilters] = useState({ invoice: '', transaction_status: '', from: '', to: '', sort: '', order: '' });
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalData, setTotalData] = useState(0);

    const { isOpen, onOpen, onClose } = useDisclosure();


    const itemsPerPage = 4;

    const getTotalData = async () => {
        try {
            const token = Cookies.get('sehatToken')

            const totalData = await axios.get(`${API_URL}/transaction/count`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setTotalData((prev) => (prev = totalData.data.total_data));

        } catch (error) {

        }
    }

    const getTransactions = async () => {
        try {

            const token = Cookies.get('sehatToken')

            if (!filters.invoice && !filters.transaction_status && !filters.to && filters.from && filters.sort && filters.order) {
                let temp = [];
                for (let filter in filters) {
                    if (filters[filter] !== '') {
                        temp.push(`${filter}=${filters[filter]}`);
                    }
                }

                const result = await axios.get(API_URL + `/transaction/get_transaction?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage - 1)}&${temp.join('&')}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTransactionList((prev) => (prev = result.data.transactions));
                return;
            };

            if (filters.invoice || filters.transaction_status || filters.to || filters.from || filters.sort || filters.order) {
                let temp = [];
                for (let filter in filters) {
                    if (filters[filter] !== '') {
                        temp.push(`${filter}=${filters[filter]}`);
                    }
                }

                const result = await axios.get(API_URL + `/transaction/get_transaction?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage - 1)}&${temp.join('&')}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (result.data.success) {
                    setTransactionList((prev) => (prev = result.data.transactions));
                }

                return;
            };

            const result = await axios.get(API_URL + `/transaction/get_transaction?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage - 1)}&sort=Date&order=desc`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setTransactionList((prev) => (prev = result.data.transactions));

        } catch (error) {
            console.log(error);
        }
    };

    const resetFilter = () => {
        setFilters((prev) => (prev = { invoice: '', transaction_status: '', from: '', to: '', sort: '', order: '' }));
        setDateRange((prev) => (prev = { from: '', to: '' }));
        setCurrentPage(prev => prev = 1);
    };

    const btnSubmitDateRange = () => {
        if (!dateRange.from || !dateRange.to) {
            console.log('wrong format');
        } else {
            setFilters((prev) => (prev = { ...prev, from: dateRange.from, to: dateRange.to }));
            onClose();
        }
    };

    useEffect(() => {
        getTransactions();
    }, [currentPage]);

    useEffect(() => {
        if (filters.invoice || filters.transaction_status || filters.from || filters.to) {
            setTotalData((prev) => (prev = transactionList.length));
        }
    }, [transactionList])

    useEffect(() => {
        if (filters.invoice == '' && filters.transaction_status == '' && filters.from == '' && filters.to == '' && filters.sort == '' && filters.order == '') {
            getTransactions();
            getTotalData();
        };

        getTransactions();
    }, [filters])


    const dateModal = (<Modal isOpen={isOpen} onClose={onClose}>
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
                <Button colorScheme='teal' onClick={btnSubmitDateRange} >Sumbit</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>)

    return (
        <div className="bg-white">
            <div className="max-w-[1400px] mx-auto  min-h-screen pb-5 pt-10">
                <div className="w-3/4 mx-auto">
                    <p className="pb-5 text-[24px] font-medium">Transaction List</p>
                </div>
                <div className="w-3/4 mx-auto border rounded bg-white shadow p-8">
                    <p className="font-medium text-popins mb-2">Filter:</p>
                    <div className="flex justify-between ">
                        <div className="flex">
                            <div className="input-group relative flex flex-wrap items-stretch w-full">
                                <div className='inline'>
                                    <input
                                        style={{ borderRadius: 0 }}
                                        value={filters.invoice}
                                        type="text"
                                        className="relative flex-auto h-[34px] w-[211.75px] border border-borderHijau block px-3 py-1.5 text-sm font-normal text-gray-700  rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-bgWhite focus:border-borderHijau focus:outline-none"
                                        placeholder="Search invoice number"
                                        aria-label="Search"
                                        aria-describedby="button-addon3"
                                        onChange={(e) => {
                                            setCurrentPage(prev => prev = 1);
                                            setFilters(prev => ({ ...prev, invoice: e.target.value }));
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            {
                                filters.from && filters.to ?
                                    <div className="flex h-[34px] justify-between relative flex-auto w-[211.75px] block px-3 py-1.5 text-sm font-normal text-gray-700 bg-bgWhite bg-clip-padding border border-solid border-gray-500 transition ease-in-out m-0 focus:text-gray-700 focus:bg-bgWhite focus:border-borderHijau focus:outline-none">
                                        <p className="text-[14px] "> {filters.from + ' to ' + filters.to} </p>
                                        <div
                                            className="flex h-[34px] items-center text-[16px] cursor-pointer"
                                            onClick={() => {
                                                setFilters((prev) => ({ ...prev, from: '', to: '' }))
                                                setDateRange((prev) => (prev = { from: '', to: '' }))
                                                setCurrentPage(prev => prev = 1);
                                            }}
                                        >
                                            <TiDelete className="mb-3 ml-1" />
                                        </div>
                                    </div>
                                    :
                                    <button
                                        className="p-1 px-4 w-[211.75px] font-medium h-[34px] text-[15px] border border-borderHijau hover:bg-hijauBtn hover:text-white"
                                        onClick={onOpen}
                                    >
                                        <div className="flex justify-center">
                                            <div className="flex items-center">
                                                <MdDateRange className="mr-3" /> By date range
                                            </div>
                                        </div>
                                    </button>
                            }
                            {dateModal}
                        </div>

                        <div className="text-right">
                            <Menu>
                                <MenuButton as={Button} rightIcon={<HiChevronDown />} className='border border-borderHijau hover:bg-borderHijau hover:!text-white !font-medium !text-black' size='sm' colorScheme='hijau'
                                    style={{ borderRadius: 0, border: '1px solid #1F6C75' }}>
                                    {filters.transaction_status === '' ? 'Transaction Status' : `${filters.transaction_status}`}
                                </MenuButton>
                                <MenuList>

                                    <MenuItem
                                        className='text-base'
                                        onClick={() => {
                                            setFilters((prev) => ({ ...prev, transaction_status: 'Awaiting Admin Confirmation' }))
                                            setCurrentPage(prev => prev = 1);
                                        }}
                                    >
                                        Awaiting Admin Confirmation
                                    </MenuItem>

                                    <MenuItem
                                        className='text-base'
                                        onClick={() => {
                                            setFilters((prev) => ({ ...prev, transaction_status: 'Awaiting Payment' }))
                                            setCurrentPage(prev => prev = 1);
                                        }}
                                    >
                                        Awaiting Payment
                                    </MenuItem>

                                    <MenuItem
                                        className='text-base'
                                        onClick={() => {
                                            setFilters((prev) => ({ ...prev, transaction_status: 'Awaiting Payment Confirmation' }))
                                            setCurrentPage(prev => prev = 1);
                                        }}
                                    >
                                        Awaiting Payment Confirmation
                                    </MenuItem>

                                    <MenuItem
                                        className='text-base'
                                        onClick={() => {
                                            setFilters((prev) => ({ ...prev, transaction_status: 'Processed' }))
                                            setCurrentPage(prev => prev = 1);
                                        }}
                                    >
                                        Processed
                                    </MenuItem>

                                    <MenuItem
                                        className='text-base'
                                        onClick={() => {
                                            setFilters((prev) => ({ ...prev, transaction_status: 'Cancelled' }))
                                            setCurrentPage(prev => prev = 1);
                                        }}
                                    >
                                        Cancelled
                                    </MenuItem>

                                    <MenuItem
                                        className='text-base'
                                        onClick={() => {
                                            setFilters((prev) => ({ ...prev, transaction_status: 'Shipped' }))
                                            setCurrentPage(prev => prev = 1);
                                        }}
                                    >
                                        Shipped
                                    </MenuItem>

                                    <MenuItem
                                        className='text-base'
                                        onClick={() => {
                                            setFilters((prev) => ({ ...prev, transaction_status: 'Order Confirmed' }))
                                            setCurrentPage(prev => prev = 1);
                                        }}
                                    >
                                        Order Confirmed
                                    </MenuItem>

                                </MenuList>
                            </Menu>
                        </div>

                        <div className="text-right mb-5">
                            <Menu>
                                <MenuButton as={Button} rightIcon={<HiChevronDown />} className='border border-borderHijau hover:bg-borderHijau hover:!text-white !font-medium !text-black hover:brightness-110' size='sm' colorScheme='hijau'
                                    style={{ borderRadius: 0, border: '1px solid #1F6C75' }}>
                                    {filters.sort === '' ? 'Sort by' : `${filters.sort} (${filters.order}ending)`}
                                </MenuButton>
                                <MenuList>
                                    <MenuItem
                                        className='text-base'
                                        onClick={() => {
                                            setFilters((prev) => ({ ...prev, sort: 'Date', order: 'asc' }));
                                            setCurrentPage(prev => prev = 1);
                                        }}
                                    >
                                        Date (ascending)
                                    </MenuItem>

                                    <MenuItem
                                        className='text-base'
                                        onClick={() => {
                                            setFilters((prev) => ({ ...prev, sort: 'Date', order: 'desc' }))
                                            setCurrentPage(prev => prev = 1);
                                        }}
                                    >
                                        Date (descending)
                                    </MenuItem>

                                    <MenuItem
                                        className='text-base'
                                        onClick={() => {
                                            setFilters((prev) => ({ ...prev, sort: 'Invoice', order: 'asc' }))
                                            setCurrentPage(prev => prev = 1);
                                        }}
                                    >
                                        Invoice (ascending)
                                    </MenuItem>

                                    <MenuItem
                                        className='text-base'
                                        onClick={() => {
                                            setFilters((prev) => ({ ...prev, sort: 'Invoice', order: 'desc' }))
                                            setCurrentPage(prev => prev = 1);
                                        }}
                                    >
                                        Invoice (descending)
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        </div>

                        <button
                            className="border p-1 px-4 w-[145.75px] font-medium h-[34px] text-[15px] border-borderHijau hover:bg-hijauBtn hover:text-white"
                            onClick={resetFilter}
                        >
                            Reset
                        </button>
                    </div>

                </div>


                {/* Right Area : Transaction list component */}
                {
                    transactionList.map((val, idx) => {
                        return (
                            <TransactionListComponent getData={val} key={idx} />
                        )
                    })
                }

                <div className="w-3/4 mx-auto">
                    <Pagination getProductData={getTransactions} totalData={totalData} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </div>
            </div>
        </div >
    );
}