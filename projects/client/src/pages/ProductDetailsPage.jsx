import React from "react";
import { useLocation } from "react-router-dom";
import Axios from "axios";
import { API_URL } from "../helper";
import ButtonComponent from "../components/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../slices/userSlice";
import RecommendedComponent from "../components/RecommendedComponent";
import Cookies from "js-cookie";
import { Skeleton, useToast } from "@chakra-ui/react";
import { userCart } from "../slices/cartSlices";

export default function ProductDetailsPage() {
  const { state } = useLocation();
  const user = useSelector(getUser);
  const toast = useToast();
  const [data, setData] = React.useState([]);
  const [stock, setStock] = React.useState([]);
  const [addCart, setAddCart] = React.useState(1);
  const [incrBtn, setIncrBtn] = React.useState(false);
  const [decrBtn, setDecrBtn] = React.useState(true);
  const [btn, setBtn] = React.useState(false);
  const [skeleton, setSkeleton] = React.useState(true);
  const [query, setQuery] = React.useState(0);

  const getStock = React.useCallback(async (id) => {
    let getData = await Axios.get(API_URL + `/product/stock/${id}`);
    getData.data.stock.forEach((val) => {
      if (val.product_unit === data.default_unit) {
        setStock(val);
      }
    });
  });

  const getProductData = async (id) => {
    let data = await Axios.get(API_URL + `/product/select/${id}`);
    if (data.data.length === 1) {
      setData(data.data[0]);
    }
  };
  const incrQty = () => {
    setAddCart((prev) => (prev += 1));
  };

  const decrQty = () => {
    setAddCart((prev) => (prev -= 1));
  };

  const btnAddCart = async () => {
    try {
      if (addCart <= stock.product_stock) {
        let token = Cookies.get("sehatToken");
        if (token) {
          let queryParams = new URLSearchParams(window.location.search);
          let product_id = queryParams.get("id");
          let add = await Axios.post(
            API_URL + "/cart/add_cart",
            {
              product_id,
              quantity: addCart,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (add.data.success) {
            toast({
              title: "Product added to cart",
              status: "success",
              duration: 3000,
              isClosable: true,
              position: "top",
            });
            setAddCart(1);
            getStock(product_id);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    let queryParams = new URLSearchParams(window.location.search);
    let product_id = queryParams.get("id");
    setQuery(product_id);
    if (state) {
      setData(state);
      getStock(state.product_id);
    } else {
      getProductData(product_id);
      getStock(product_id);
    }
  }, [state, stock, getStock]);

  React.useEffect(() => {
    if (addCart >= stock.product_stock) {
      setIncrBtn(true);
    } else {
      setIncrBtn(false);
    }
    if (addCart <= 1) {
      setDecrBtn(true);
    } else {
      setDecrBtn(false);
    }
  }, [addCart, stock.product_stock]);

  React.useEffect(() => {
    if (!stock.product_stock) {
      setBtn(true);
    } else {
      setBtn(false);
    }
  }, [setBtn, stock.product_stock]);

  React.useEffect(() => {
    setTimeout(() => {
      setSkeleton(false);
    }, 1500);
  }, []);

  React.useEffect(() => {
    console.log(data);
    // if (data.product_image.includes('imgProduct')) {
    //   console.log(true);
    // } else {
    //   console.log(false);
    // }
  }, [data]);

  return (
    <div className="bg-bgWhite">
      <div className="max-w-[1400px] mx-auto border-borderHijau border-x min-h-[50vh]">
        <div className="px-5 py-4 lg:flex lg:justify-between">
          <div className="w-[75%] h-[60%]">
            <img
              src={
                data.product_image?.includes("imgProduct")
                  ? `http://localhost:8000/${data.product_image}`
                  : data.product_image
              }
              alt="obat-img"
              className=""
            />
          </div>
          <div className="space-y-2 pt-5 px-5 grow">
            <h1 className="text-2xl font-semibold">{data.product_name}</h1>
            <hr className="border border-borderHijau my-2 opacity-25 mb-5" />
            <h1>{data.category_name}</h1>
            <div className="py-2 space-y-4">
              <div>
                <h1>Descriptions : </h1>
                <p className="text-sm text-justify">
                  {data.product_description}
                </p>
              </div>
              <div>
                <h1>Usage instructions : </h1>
                <p className="text-sm text-justify">{data.product_usage}</p>
              </div>
            </div>
            <div>
              <h1>Stock available :</h1>
              {skeleton ? (
                <Skeleton height="20px" className="w-[25%]" />
              ) : stock.product_stock ? (
                <h1 className="text-base">
                  {stock.product_stock} {stock.product_unit}
                </h1>
              ) : (
                <h1 className="text-red-500 font-medium text-base">
                  OUT OF STOCK
                </h1>
              )}
            </div>
          </div>
          <div className="space-y-2 pt-5 px-5">
            <h1 className="text-xl font-medium">
              Rp{data.product_price?.toLocaleString("id")},-
            </h1>
            <div className="space-y-5 flex flex-col items-center justify-center">
              {user.role === "CUSTOMER" ? (
                <>
                  <div className="flex items-center justify-center space-x-5 pt-5">
                    <ButtonComponent
                      text="-"
                      px="2"
                      py="2"
                      brightness="90"
                      disabled={decrBtn}
                      class="border border-borderHijau text-black hover:bg-borderHijau hover:text-white rounded-lg text-xl font-semibold w-[40px] disabled:opacity-50 disabled:hover:brightness-100 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black"
                      onclick={decrQty}
                    />
                    <h1 className="py-2 ">
                      {stock.product_stock ? addCart : "0"}
                    </h1>
                    <ButtonComponent
                      text="+"
                      px="2"
                      py="2"
                      brightness="90"
                      disabled={incrBtn}
                      class="border border-borderHijau text-black hover:bg-borderHijau hover:text-white rounded-lg text-xl font-semibold w-[40px] disabled:opacity-50 disabled:hover:brightness-100 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black"
                      onclick={incrQty}
                    />
                  </div>
                  <ButtonComponent
                    text="Add to cart"
                    px="5"
                    py="3"
                    class="border border-borderHijau text-black rounded-full hover:bg-borderHijau hover:text-white fond-medium disabled:opacity-50 disabled:hover:brightness-100 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black"
                    onclick={btnAddCart}
                    disabled={btn}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
      <RecommendedComponent currentId={query} />
    </div>
  );
}