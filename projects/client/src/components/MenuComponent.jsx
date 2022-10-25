import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { API_URL } from '../helper';
import ButtonComponent from './ButtonComponent';
import CarouselComponent from './CarouselComponent';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function MenuComponent() {
    const [data, setData] = React.useState([]);
    const navigate = useNavigate();

    const getProduct = async () => {
        try {
            let result = await Axios.get(API_URL + '/product?limit=4&offset=0');
            if ((await result).data.success) {
                setData((prev) => (prev = result.data.products));
            }
        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        getProduct();
    }, []);

  return (
    <div className='bg-bgHijau min-h-screen px-20 py-36'>
        <h1 className='text-4xl'>Most Loved, best picks</h1>
        <div className='sm:flex sm:items-center sm:justify-between my-3 space-y-2'>
            <h6 className='text-xs sm:text-sm'>
                Not sure what's the correct one for you?
            </h6>
            <div className='flex items-center space-x-2 hover:underline cursor-pointer'>
                <h6 className='text-sm font-semibold'>CONSULT WITH OUR PROFESSIONALS</h6>
                <IoIosArrowForward/>
            </div>
        </div>
        <div className='flex justify-center items-center'>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 2xl:grid-cols-4'>
            {data.map((val) => {
                return (
                    <CarouselComponent foto={val.product_image} name={val.product_name} category={val.category_name} price={val.product_price} id={val.product_id} key={val.product_id}/>
                )
            })}
        </div>
        </div>
        <div className='flex justify-center mt-8'>
            <ButtonComponent text='SHOW MORE' py='2' px='8' brightness='90' class='border-borderHijau bg-bgWhite text-black font-semibold border' onclick={() => navigate('/product')}/>
        </div>
    </div>
  )
}
