import React from "react";
import ButtonComponent from "../components/ButtonComponent";
import Axios from "axios";
import { API_URL } from "../helper";
import {
  Button,
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
import CarouselComponent from '../components/CarouselComponent';
import Pagination from "../components/Pagination";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProductListPage() {
  const {pathname, state, search} = useLocation();
  const [categoryData, setCategoryData] = React.useState([]);
  const [filters, setFilters] = React.useState({ product_name : '', category_name : state ? state.category : '', sort : '', order : ''});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [productData, setProductData] = React.useState([]);
  const [totalData, setTotalData] = React.useState(0);
  const navigate = useNavigate();
  const itemsPerPage = 12;
  const query = new URLSearchParams(window.location.search);
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
          if (filters[filter] !== '') {
            temp.push(`${filter}=${filters[filter]}`);
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
            temp.push(`${filter}=${filters[filter]}`);
          }
        }
        const result = await Axios.get(API_URL + `/product?limit=${itemsPerPage}&offset=${itemsPerPage * (currentPage -1)}&${temp.join('&')}`);
        if (result.data.success) {
          setProductData((prev) => (prev= result.data.products));
        }
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
      const totalData = await Axios.get(API_URL + '/product/count');
      setTotalData((prev) => (prev = totalData.data.total_data));
    } catch (error) {
      console.log(error);
    }
  }

  const resetFilter = async() => {
    try {
      let params = new URLSearchParams(window.location.search);
      if (params.get('category')) {
        navigate('/product')
      }
      setFilters((prev) => (prev = { product_name : '', category_name : '', sort : '', order : ''}));
      setCurrentPage(prev => prev = 1) ;
      // await getProduct();
      // await getTotalProduct();
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    getCategory();
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // React.useEffect(() => {
  //   console.log(search);
  //   let searchQuery = search.split('=');
  //   if (search) {
  //     setFilters((prev) => ({...prev, category_name : searchQuery[1]}));
  //     console.log(filters);
  //   }
  // }, [search]);

  // React.useEffect(() => {
  //   if (query.get('category')) {
  //     setFilters((prev) => ({...prev, ...query}))
  //   } else {
  //     setFilters((prev) => (prev = { product_name : '', category_name : '', sort : '', order : ''}))
  //   }
  //   console.log(query);
  //   console.log(filters);
  // }, [query]);

  React.useEffect(() => {
    getProduct();
  }, [state]);

  React.useEffect(() => {
    getProduct();
  }, [currentPage]);

  React.useEffect(() => {
    if (filters.category_name || filters.product_name) {
      setTotalData((prev) => (prev= productData.length));
    }
  }, [productData, filters.category_name, filters.product_name]);
  
  React.useEffect(() => {
    if (filters.category_name === '' && filters.product_name === '' && filters.sort === '' && filters.sort === '') {
      getTotalProduct();
      getProduct();
    } else {
      getProduct();
    }
  }, [filters]);

  return (
    <div className="bg-bgWhite">
      <div className="max-w-[1400px] mx-auto border-borderHijau border-x min-h-screen">
        <div className="space-y-2 pt-5 px-5">
          <h1 className="text-2xl font-semibold">Shop Everything</h1>
          <h1 className="">Find the correct medicine for your health</h1>
        </div>
        <div className="grid xl:grid-cols-6 gap-4 mt-10 grid-cols-2 px-5 md:grid-cols-4">
          <div className="hidden md:inline">
            <h1 className="font-medium mb-2">Filter</h1>
            <hr className="border border-borderHijau my-2 opacity-25 mb-5" />
            <RadioGroup onChange={setFilters.category_name} value={filters.category_name}>
              <Stack>
                {categoryData.map((val) => {
                  return (
                    <Radio
                      value={val.category_name}
                      colorScheme="teal"
                      key={val.category_id}
                      onClick={()=> {
                        setFilters((prev) => ({...prev, category_name : val.category_name}));
                        setCurrentPage(prev => prev = 1);
                      }}
                    >
                      {val.category_name}
                    </Radio>
                  );
                })}
              </Stack>
            </RadioGroup>
            <SearchBar filters={filters} setFilters={setFilters} inputValue={filters.product_name} setCurrentPage={setCurrentPage}/>
            <div className="space-x-5">
              <ButtonComponent
                text="Reset"
                py="2"
                px="5"
                brightness="90"
                class="border border-borderHijau hover:bg-borderHijau hover:text-white font-medium rounded-full my-3"
                onclick={resetFilter}
              />
            </div>
          </div>
          <div className="xl:col-span-5 md:col-span-3">
            <div className="text-right mb-5">
              {/* bikin dropdown untuk filter mobile */}
              <Menu>
                <MenuButton as={Button} rightIcon={<HiChevronDown />} className='border border-borderHijau hover:bg-borderHijau hover:!text-white !font-medium !text-black hover:brightness-110' size='sm' colorScheme='hijau'
                style={{ borderRadius : 0, border : '1px solid #1F6C75'}}>
                  {filters.sort === '' ? 'Sort by' : `${filters.sort} (${filters.order}ending)`}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => {
                    setCurrentPage(prev => prev = 1);
                    setFilters((prev) => ({...prev, sort: 'Name', order : 'asc'}))
                  }} className='text-base'>Name (ascending)</MenuItem>
                  <MenuItem onClick={() => {
                    setCurrentPage(prev => prev = 1);
                    setFilters((prev) => ({...prev, sort: 'Name', order : 'desc'}))
                  }} className='text-base'>Name (descending)</MenuItem>
                  <MenuItem onClick={() => {
                    setCurrentPage(prev => prev = 1);
                    setFilters((prev) => ({...prev, sort: 'Price', order : 'asc'}))
                  }} className='text-base'>Price (ascending)</MenuItem>
                  <MenuItem onClick={() => {
                    setCurrentPage(prev => prev = 1);
                    setFilters((prev) => ({...prev, sort: 'Price', order : 'desc'}))
                  }} className='text-base'>Price (descending)</MenuItem>
                </MenuList>
              </Menu>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-10 pb-10 px-10 ">
              {productData.map((val) => {
                return (
                  <CarouselComponent foto={val.product_image} name={val.product_name} category={val.category_name} price={val.product_price} key={val.product_id} id={val.product_id} data={val}/>
                )
              })}
            </div>
          </div>
        </div>
        <Pagination getProductData={getProduct} totalData={totalData} itemsPerPage={itemsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      </div>
    </div>
  );
}
