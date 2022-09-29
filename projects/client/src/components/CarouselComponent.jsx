import React from "react";
import ButtonComponent from "./ButtonComponent";

export default function Carousel(props) {

  const [data, setData] = React.useState([]);

  React.useEffect(() => {

  })


  return (
    <div className="border-2 border-gray-300 rounded-md p-4 lg:w-[275px] 2xl:[300px] sm:w-[300px] md:w-[250px] w-full bg-white">
      <div className="border-b-2 border-gray-800 pb-7">
        <img src={props.foto} alt="obat-img" className="h-[250px]" />
      </div>
      <div className="pt-2 space-y-1">
        <h1 className="font-normal text-base">{props.name}</h1>
        <h6 className="text-sm text-muted font-light">{props.category}</h6>
      </div>
      <div className="pt-2 w-full flex items-center">
        {/* <button className="grow border-y border-l py-1.5 border-black px-1 hover:brightness-95 bg-white font-medium h-[45px] sm:h-auto text-xs lg:text-base lg:px-4 lg:py-2.5 md:py-3.5 sm:py-3.5">
          ADD TO CART
        </button> */}
        <ButtonComponent text='ADD TO CART' class='grow border-y border-l border-black bg-white font-medium h-[45px] sm:h-auto text-xs lg:text-base lg:px-4 lg:py-2.5 md:py-3.5 sm:py-3.5' brightness='95' py='1.5' px='1'/>
        {/* <button className="border py-3 sm:text-sm border-black px-2.5 bg-white cursor-default h-[45px] sm:h-auto text-xs">
          {props.price}
        </button> */}
        <ButtonComponent text={props.price} class='border sm:text-sm border-black bg-white cursor-default h-[45px] sm:h-auto text-xs' px='2.5' py='3'/>
      </div>
    </div>
  );
}
