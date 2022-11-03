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
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { BsCalendarDate } from "react-icons/bs";
import { HiOutlineChevronDown } from "react-icons/hi";
import Axios from "axios";
import { API_URL } from "../helper";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Pagination from "../components/Pagination";
import * as XLSX from 'xlsx';
import { useNavigate } from "react-router-dom";
import HeadComponent from "../components/HeadComponent";

export default function AdminReportUser() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filters, setFilters] = React.useState({
    date_from: "",
    date_to: "",
    sort: "",
    order: "",
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalData, setTotalData] = React.useState(0);
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [dataChart, setDataChart] = React.useState([]);
  const [labelChart, setLabelChart] = React.useState({});
  const options = {responsive : true,
    plugins : {
      title : {
        display : true,
        text : 'User report'
      },
    },
    scales : {
      y : {
        beginAtZero : true,
        title : {
          display : true,
          text : 'Total Transaction Made'
        }
      },
      x : {
        title : {
          display : true,
          text : 'user'
        }
      }
    }}
  const itemsPerPage = 10;
  const toast = useToast();
  const navigate = useNavigate();
  const btnClosePopover = async () => {
    try {
      if (dateFrom && dateTo) {
        if (dateFrom >= dateTo) {
          setFilters((prev) => ({...prev, date_from : '', date_to : ''}));
          toast({
            title : 'Please enter a valid date range',
            description : 'Date range is not valid',
            status : 'warning',
            duration : 3000,
            isClosable : true,
            position : 'top'
          })
        } else {
          setCurrentPage((prev) => (prev = 1));
          setFilters((prev) => ({...prev, date_from : dateFrom, date_to : dateTo}));
        }
      } else {
        setFilters((prev) => ({...prev, date_from : '', date_to : ''}));
        setDateFrom('');
        setDateTo('');
      }
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const resetFilter = async () => {
    try {
      setFilters((prev) => (prev = {date_from : '', date_to : '', sort : '', order : ''}));
      setDateFrom('');
      setDateTo('');
      setCurrentPage((prev) => prev = 1);
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalData = async () => {
    try {
      let total = await Axios.get(API_URL + '/admin/get_user_table');
      setTotalData((prev) => prev = total.data.length);
    } catch (error) {
      console.log(error);
    }
  }

  const getData = async () => {
    try {
      if (!filters.date_from && !filters.date_to && filters.sort && filters.order) {
        let temp = [];
        for (let filter in filters) {
          if (filters[filter] !== '') {
            temp.push(`${filter}=${filters[filter]}`);
          }
        }
        console.log(temp.join('&'));
        const result = await Axios.get(API_URL + `/admin/get_user_report?${temp.join('&')}`);
        const dataTable = await Axios.get(API_URL + `/admin/get_user_table?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage -1)}&${temp.join("&")}`);
        console.log(result.data);
        if (dataTable.data.success) {
          setDataChart((prev) => (prev = dataTable.data.dataMap));
          setLabelChart((prev) => (prev = result.data.data));
          return;
        } else {
          toast({
            title: "Data not found",
            description: "Data do not exist",
            status: "error",
            duration: 3000,
            isClosable: true,
            position : 'top'
          });
          setFilters(
            (prev) =>
              (prev = { date_from: "", date_to: "", sort: "", order: "" })
          );
        }
      }
      if (filters.date_from || filters.date_to || filters.sort || filters.order) {
        let temp = [];
        for (let filter in filters) {
          if (filters[filter] !== '') {
            temp.push(`${filter}=${filters[filter]}`);
          }
        }
        const result = await Axios.get(API_URL + `/admin/get_user_report?${temp.join('&')}`);
        const dataTable = await Axios.get(API_URL + `/admin/get_user_table?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage -1)}&${temp.join("&")}`);
        if (dataTable.data.success) {
          setDataChart((prev) => (prev = dataTable.data.dataMap));
          setLabelChart((prev) => (prev = result.data.data));
          return;
        } else {
          toast({
            title: "Data not found",
            description: "Data do not exist",
            status: "error",
            duration: 3000,
            isClosable: true,
            position : 'top'
          });
          setFilters(
            (prev) =>
              (prev = { date_from: "", date_to: "", sort: "", order: "" })
          );
          setDateFrom("");
          setDateTo("");
        }
      }
      let getRes = await Axios.get(API_URL + "/admin/get_user_report");
      const dataTable = await Axios.get(API_URL + `/admin/get_user_table?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage -1)}`);
      if (dataTable.data.success) {
        setDataChart(dataTable.data.dataMap);
        setLabelChart(getRes.data.data);
      } else {
        toast({
          title: "Data not found",
          description: "Data do not exist",
          status: "error",
          duration: 3000,
          isClosable: true,
          position : 'top'
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const exportData = async () => {
    const dataExport = await Axios.get(API_URL + '/admin/get_user_table?sort=date&order=asc');
    const fields = Object.keys(dataExport.data.dataMap[0]);
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dataExport.data.dataMap, {headers : fields});
    XLSX.utils.book_append_sheet(workbook, worksheet, 'User Sales Report');
    XLSX.writeFile(workbook, 'UserReport.xlsx');
  }
  React.useEffect(() => {
    getData();
  }, [currentPage]);

  React.useEffect(() => {
    if (filters.date_from || filters.date_to) {
      setTotalData((prev) => prev = dataChart.length);
    }
  }, [dataChart, filters.date_from, filters.date_to]);

  React.useEffect(() => {
    if (filters.date_from === '' && filters.date_to === '' && filters.sort === '' && filters.order === '') {
      getTotalData();
      getData();
    } else {
      getData();
    }
  }, [filters]);

  return (
    <>
      <HeadComponent title={'SEHATBOS | Admin Report User'} description={'Admin Report User'} type={'website'}/>
      <div className="bg-bgWhite min-h-screen py-5 px-5 lg:px-[10vw]">
        <div className="container mx-auto mt-[2.5vh]">
          <h1 className="font-bold text-lg text-hijauBtn text-center cursor-pointer" onClick={() => {
              navigate('/admin');
            }}>
            SEHATBOS.COM <span className="font-normal">| SALES REPORT</span>
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
              <BreadcrumbLink href="/admin/report/sales">
                Sales Report
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink>User Report</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>

        {/* chart */}
        <div className="mt-3">
          {Object.keys(labelChart).length > 0 && 
          <Bar options={options} 
          height={"80%"} 
          data={labelChart} 
          />
          }
        </div>
        <div className="container mx-auto lg:mt-3 text-[rgb(49,53,65,0.75)] lg:grid justify-items-end ">
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
                <PopoverArrow />
                <PopoverHeader fontWeight="bold">Filter by date</PopoverHeader>
                <PopoverBody className="flex flex-col items-center space-y-2 mx-5">
                  <Input
                    type="date"
                    onChange={(e) => {
                      setDateFrom((prev) => (prev = e.target.value));
                    }}
                  />
                  <h1 className="">to</h1>
                  <Input
                    type="date"
                    onChange={(e) => {
                      setDateTo((prev) => (prev = e.target.value));
                    }}
                  />
                </PopoverBody>
                <PopoverFooter border="0" pb={4}>
                  <div className="flex justify-end space-x-5">
                    <Button colorScheme="blue" onClick={btnClosePopover}>
                      Close
                    </Button>
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
                <MenuItem
                  className="text-xs"
                  onClick={() => {
                    setCurrentPage((prev) => (prev = 1));
                    setFilters((prev) => ({
                      ...prev,
                      sort: "sales",
                      order: "asc",
                    }));
                  }}
                >
                  {"Total Sales (Ascending)"}
                </MenuItem>
                <MenuItem
                  className="text-xs"
                  onClick={() => {
                    setCurrentPage((prev) => (prev = 1));
                    setFilters((prev) => ({
                      ...prev,
                      sort: "sales",
                      order: "desc",
                    }));
                  }}
                >
                  {"Total Sales (Descending)"}
                </MenuItem>
              </MenuList>
            </Menu>
            <Button
              style={{ borderColor: "gray" }}
              disabled={
                !filters.product_name &&
                !filters.sort &&
                !filters.order &&
                !filters.date_from &&
                !filters.date_to
              }
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
            <h1 className="inline">User Report</h1>
          </Box>
        </div>
        <div className="flex container mx-auto bg-[rgb(2,93,103,0.1)] mb-[2.5vh]">
          <TableContainer w="100vw" fontSize="xs">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>No.</Th>
                  <Th>Date</Th>
                  <Th>Username</Th>
                  <Th>Total Transaction Made</Th>
                  <Th>Total Amount</Th>
                  {/* <Th>Detail List</Th> */}
                </Tr>
              </Thead>
              <Tbody>
                {dataChart.map((val, idx) => {
                  return (
                    <Tr key={idx+1}>
                      <Td>{idx + 1}</Td>
                      <Td>
                        {new Date(val.date).toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Td>
                      <Td>{val.username}</Td>
                      <Td>{val.total}</Td>
                      <Td>Rp{val.subtotal.toLocaleString("id")},-</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
        <div className="my-2 flex justify-end">
        <Button
              style={{ borderColor: "gray" }}
              borderRadius={"0"}
              color="gray"
              variant="outline"
              size={"sm"}
              onClick={exportData}
              className='hover:!bg-hijauBtn hover:!text-white'
            >
              Download
            </Button>
        
        </div>
        <Pagination getProductData={getData} totalData={totalData} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      </div>
    </>
  );
}
