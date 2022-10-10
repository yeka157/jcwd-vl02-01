import React from "react";
import ButtonComponent from "../components/ButtonComponent";
import Axios from "axios";
import { API_URL } from "../helper";
import {
  Button,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import SearchBar from "../components/SearchBar";
import { HiChevronDown } from "react-icons/hi";

export default function ProductListPage() {
  const [categoryData, setCategoryData] = React.useState([]);
  const [categoryFilter, setCategoryFilter] = React.useState("0");
  const [filters, setFilters] = React.useState({ product_name : '', category_name : '', sort : '', order : ''});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [productData, setProductData] = React.useState([]);

  const itemsPerPage = 10;

  const getCategory = async () => {
    let getData = await Axios.get(API_URL + "/category/");
    if (getData.data.success) {
      setCategoryData(getData.data.category);
    } else {
      console.log("error");
    }
  };

  const getProduct = async () => {
    try {
      if (!filters.category_name && !filters.product_name && filters.sort && filters.order) {
        let temp = [];
        for (let filter in filters) {
          if (filters[filter] != '') {
            temp.push(`${filter} = ${filters[filter]}`);
          }
        }
        const result = await Axios.get(API_URL + `/product?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage-1)}&${temp.join('&')}`);
        setProductData((prev) => (prev = result.data.products));
        return;
      }

      if (filters.category_name || filters.product_name || filters.sort || filters.order) {
        let temp = [];
        for (let filter in filters) {
          if (filters[filter] !== '') {
            temp.push(`${filter} = ${filters[filter]}`);
          }
        }

        const result = await Axios.get(API_URL + `/product?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage -1)}&${temp.join('&')}`);
        setProductData((prev) => (prev= result.data.products));
        return;
      }

      const result = await Axios.get(API_URL + `/product?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage -1)}`);
      setProductData((prev) => (prev=result.data.products));
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalProduct = async () => {
    try {
      const totalData = await Axios.get(API_URL + '/product/count')
    } catch (error) {
      console.log(error);
    }
  }
  
  React.useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className="bg-bgWhite">
      <div className="max-w-[1400px] mx-auto border-borderHijau border-x min-h-screen">
        <div className="space-y-2 pt-5 px-5">
          <h1 className="text-2xl font-semibold">Shop Everything</h1>
          <h1>Find the correct medicine for your health</h1>
        </div>
        <div className="grid xl:grid-cols-6 gap-4 mt-10 grid-cols-2 px-5 md:grid-cols-4">
          <div className="hidden md:inline">
            <h1 className="font-medium">Filter</h1>
            <hr className="border border-borderHijau my-2 opacity-25" />
            <RadioGroup onChange={setCategoryFilter} value={categoryFilter}>
              <Stack>
                {categoryData.map((val) => {
                  return (
                    <Radio
                      value={`${val.category_id}`}
                      colorScheme="teal"
                      key={val.category_id}
                    >
                      {val.category_name}
                    </Radio>
                  );
                })}
              </Stack>
            </RadioGroup>
            <SearchBar />
            <div className="space-x-5">
              <ButtonComponent
                text="Reset"
                py="2"
                px="5"
                brightness="90"
                class="border border-borderHijau hover:bg-borderHijau hover:text-white font-medium rounded-full my-3"
                onclick={() => setCategoryFilter("0")}
              />
              <ButtonComponent
                text="Search"
                py="2"
                px="5"
                brightness="90"
                class="border border-borderHijau hover:bg-borderHijau hover:text-white font-medium rounded-full my-3"
                onclick={() => setCategoryFilter("0")}
              />
            </div>
            {/* Left Area : Filter bar  */}
          </div>
          <div className="xl:col-span-5 md:col-span-3">
            <div className="text-right">
              <Menu>
                <MenuButton as={Button} rightIcon={<HiChevronDown />}>
                  Sort by
                </MenuButton>
                <MenuList>
                  <MenuItem>Name (ascending)</MenuItem>
                  <MenuItem>Name (descending)</MenuItem>
                  <MenuItem>Price (ascending)</MenuItem>
                  <MenuItem>Price (descending)</MenuItem>
                </MenuList>
              </Menu>
            </div>
            {/* Right Area : Product Carousel with sort */}
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
