import React from 'react';
import Axios from 'axios';
import { API_URL } from '../helper';
import CarouselComponent from './CarouselComponent';

export default function RecommendedComponent(props) {
    const [arrNum, setArrNum] = React.useState([]);

    const selectRandomProduct = async() => {
        try {
            let queryParams = new URLSearchParams(window.location.search);
            let query = queryParams.get("id");
            if (arrNum.length !== 4 ) {
                let getData = await Axios.get(API_URL + `/product/random/${query}`);
                if (getData.data.length === 4) {
                    setArrNum((prev) => prev = getData.data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    React.useEffect(() => {
        if (!arrNum.length) {
            selectRandomProduct();
        }
    }, [arrNum]);

  return (
    <div className='bg-bgWhite'>
        <div className='max-w-[1400px] mx-auto border-x border-borderHijau pb-10'>
            <div className='px-5 py-4'>
                <div className='space-y-2 mb-5 border-b-2 border-borderHijau border-opacity-25 py-3'>
                <h1 className='text-xl font-medium'>Recommended</h1>
                <h1 className='text-sm font-normal'>You might need it</h1>
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
                    {arrNum.map((val) => {
                        return (
                            <CarouselComponent foto={val.product_image} name={val.product_name} category={val.category_name} price={val.product_price} id={val.product_id} data={val} key={val.product_id}/>
                        )
                    })}
                </div>
            </div>
        </div>
    </div>
  )
}
