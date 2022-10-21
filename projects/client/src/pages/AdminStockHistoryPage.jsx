import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import Axios from "axios";
import { API_URL } from "../helper";
import SearchBar from "../components/SearchBar";
import { HiOutlineChevronDown } from "react-icons/hi";
import { BsCalendarDate } from "react-icons/bs";
import Pagination from "../components/Pagination";

export default function AdminStockHistoryPage() {
  const [history, setHistory] = React.useState([]);
  const [filters, setFilters] = React.useState({
    product_name: "",
    date_from: "",
    date_to: "",
    sort: "",
    order: "",
  });
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalData, setTotalData] = React.useState(0);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const itemsPerPage = 10;

  const getData = async () => {
    try {
      if (
        !filters.product_name &&
        !filters.date_from &&
        !filters.date_to &&
        filters.sort &&
        filters.order
      ) {
        let temp = [];
        for (let filter in filters) {
          if (filters[filter] !== "") {
            temp.push(`${filter}=${filters[filter]}`);
          }
        }
        const result = await Axios.get(
          API_URL +
            `/admin/get_stock_history?limit=${itemsPerPage}&offset=${
              itemsPerPage * (currentPage - 1)
            }&${temp.join("&")}`
        );
        if (result.data.length) {
          setHistory((prev) => (prev = result.data));
          return;
        }
      }
      if (
        filters.product_name ||
        filters.date_from ||
        filters.date_to ||
        filters.sort ||
        filters.order
      ) {
        let temp = [];
        for (let filter in filters) {
          if (filters[filter] !== "") {
            temp.push(`${filter}=${filters[filter]}`);
          }
        }
        console.log(temp);
        const result = await Axios.get(
          API_URL +
            `/admin/get_stock_history?limit=${itemsPerPage}&offset=${
              itemsPerPage * (currentPage - 1)
            }&${temp.join("&")}`
        );
        if (result.data.length) {
          setHistory((prev) => (prev = result.data));
          return;
        }
      }
      let data = await Axios.get(
        API_URL +
          `/admin/get_stock_history?limit=${itemsPerPage}&offset=${
            itemsPerPage * (currentPage - 1)
          }`
      );
      if (data.data.length) {
        setHistory((prev) => (prev = data.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const btnClosePopover = async () => {
    try {
      console.log(dateFrom);
      console.log(dateTo);
      if (dateFrom && dateTo) {
        if (dateFrom >= dateTo) {
          setFilters((prev) => ({...prev, date_from : '', date_to : ''}));
          console.log("yes");
          // keluarin toast
        } else {
          setCurrentPage((prev) => (prev = 1));
          setFilters((prev) => ({...prev, date_from : dateFrom, date_to : dateTo}));
          console.log("none");
        }
        onClose();
      } else {
        setFilters((prev) => ({...prev, date_from : '', date_to : ''}));
        // keluarin toast
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalData = async () => {
    try {
      let total = await Axios.get(API_URL + '/admin/total_stock_history');
      setTotalData((prev) => prev = total.data[0].count);
    } catch (error) {
      console.log(error);
    }
  }

  const resetFilter = async () => {
    try {
      setFilters((prev) => (prev = {product_name : '', date_from : '', date_to : '', sort : '', order : ''}));
      setCurrentPage((prev) => prev = 1);
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getData();
  }, [currentPage]);

  React.useEffect(() => {
    if (filters.product_name || filters.date_from || filters.date_to) {
      setTotalData((prev) => prev = history.length);
    }
  }, [history, filters.product_name, filters.date_from, filters.date_to]);

  React.useEffect(() => {
    if (filters.product_name === '' && filters.sort === '' && filters.order === '' && filters.date_from === '' && filters.date_to === '') {
      getTotalData();
      getData();
    } else {
      getData();
    }
  }, [filters])

  return (
    <div className="bg-bgWhite min-h-screen py-5 px-5 lg:px-[10vw]">
      <div className="container mx-auto mt-[2.5vh]">
        <h1 className="font-bold text-lg text-hijauBtn text-center">
          SEHATBOS.COM <span className="font-normal">| STOCK HISTORY</span>
        </h1>
      </div>

      <div className="container mx-auto mt-[5vh] grid justify-items-start">
        <h1 className="font-bold text-lg">Sales Report</h1>
        <Breadcrumb fontSize="xs" className="text-[rgb(49,53,65,0.75)]">
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/report">Report</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink>Stock History</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
       <SearchBar
          filters={filters}
          setFilters={setFilters}
          inputValue={filters.product_name}
          setCurrentPage={setCurrentPage}
          getProductData={getData}
          placeholder={"Search by product name"}
        />
      <div className="container mx-auto lg:mt-[-45px] text-[rgb(49,53,65,0.75)] lg:grid justify-items-end ">
        <div className="space-x-3">
        <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
          <PopoverTrigger>
            <Button
              rightIcon={<BsCalendarDate />}
              style={{ borderColor: "gray" }}
              borderRadius={"0"}
              color="gray"
              variant="outline"
              size={"sm"}
            >
              {filters.date_from && filters.date_to
                ? filters.date_from + " - " + filters.date_to
                : "Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow/>
            <PopoverHeader fontWeight='bold'>Filter by date</PopoverHeader>
            <PopoverBody className="flex flex-col items-center space-y-2 mx-5">
              <Input type='date' onChange={(e) => {
                setDateFrom((prev) => prev = e.target.value);
                }} />
              <h1 className="">to</h1>
              <Input type='date' onChange={(e) => {
                setDateTo((prev) => prev = e.target.value);
                }} />
            </PopoverBody>
            <PopoverFooter border='0' pb={4}>
              <div className="flex justify-end space-x-5">
                <Button colorScheme='blue' onClick={btnClosePopover}>Close</Button>
              </div>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
          <Menu>
            <MenuButton
              className="text-gray"
              style={{ borderRadius: 0, border: "1px solid gray" }}
              as={Button}
              rightIcon={<HiOutlineChevronDown />}
              size={"sm"}
            >
              {filters.sort === ""
                ? "Sort"
                : `${filters.sort} (${filters.order})`}
            </MenuButton>
            <MenuList>
              <MenuItem
                className="text-xs"
                onClick={() => {
                  setCurrentPage((prev) => (prev = 1));
                  setFilters((prev) => ({ ...prev, sort: "", order: "" }));
                }}
              >
                None
              </MenuItem>
              <MenuItem
                className="text-xs"
                onClick={() => {
                  setCurrentPage((prev) => (prev = 1));
                  setFilters((prev) => ({
                    ...prev,
                    sort: "date",
                    order: "asc",
                  }));
                }}
              >
                {"Date (Ascending)"}
              </MenuItem>
              <MenuItem
                className="text-xs"
                onClick={() => {
                  setCurrentPage((prev) => (prev = 1));
                  setFilters((prev) => ({
                    ...prev,
                    sort: "date",
                    order: "desc",
                  }));
                }}
              >
                {"Date (Descending)"}
              </MenuItem>
            </MenuList>
          </Menu>
          <Button
            style={{ borderColor: "gray" }}
            disabled={!filters.product_name && !filters.sort && !filters.order && !filters.date_from && !filters.date_to}
            borderRadius={"0"}
            color="gray"
            variant="outline"
            size={"sm"}
            onClick={resetFilter}
          >
            Reset Filter
          </Button>
        </div>
      </div>
      <div className="flex container mx-auto mt-[2.5vh] justify-center content-center">
        <Box
          w="100vw"
          borderWidth="1px"
          overflow="hidden"
          fontWeight="semibold"
          lineHeight="tight"
          className="py-[5px] border-borderHijau text-center bg-hijauBtn text-bgWhite"
        >
          <h1 className="inline">Stock History</h1>
        </Box>
      </div>
      <div className="flex container mx-auto bg-[rgb(2,93,103,0.1)] mb-[2.5vh]">
        <TableContainer w="100vw" fontSize="xs">
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>No.</Th>
                <Th>Date</Th>
                <Th>Product</Th>
                <Th>Quantity</Th>
                <Th>Unit</Th>
                <Th>Type</Th>
                <Th>Note</Th>
              </Tr>
            </Thead>
            <Tbody>
              {history.map((val, idx) => {
                return (
                  <Tr>
                    <Td>{idx + 1}</Td>
                    <Td>
                      {new Date(val.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour : '2-digit',
                        minute : '2-digit',
                        second : '2-digit',
                        timeZoneName : 'short'
                      })}
                    </Td>
                    <Td>{val.product_name}</Td>
                    <Td
                      className={`${
                        val.note === "Substraction"
                          ? "text-red-500 font-bold"
                          : ""
                      }`}
                    >
                      {val.note === "Substraction" ? "- " : ""}
                      {val.quantity}
                    </Td>
                    <Td>{val.product_unit}</Td>
                    <Td>{val.type}</Td>
                    <Td>{val.note}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
      <Pagination getProductData={getData} totalData={totalData} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}
