import React from "react";
import ButtonComponent from "./ButtonComponent";
import { useNavigate } from "react-router-dom";


export default function CarouselComponent(props) {
  const navigate = useNavigate();

  return (
    <div className="border-2 border-gray-300 rounded-md p-4 lg:w-[275px] 2xl:[300px] sm:w-[300px] md:w-[250px] w-full bg-white">
      <div className="border-b-2 border-gray-800 pb-7">
        <img src={props.foto.includes('imgProduct') ? `http://localhost:8000/${props.foto}` : props.foto} alt="obat-img" className="h-[250px]" />
      </div>
      <div className="pt-2 space-y-1">
        <h1 className="font-normal text-base">{props.name}</h1>
        <h6 className="text-sm text-muted font-light">{props.category}</h6>
      </div>
      <div className="pt-2 w-full flex items-center">
        <ButtonComponent
          text="Show Details"
          class="grow border-y border-l border-black bg-white font-medium h-[45px] sm:h-auto text-xs lg:text-base lg:px-3 lg:py-2.5 md:py-3.5 sm:py-3.5"
          brightness="90"
          py="1.5"
          px="1"
          onclick={()=> navigate(`/product/detail?id=${props.id}`, { state : props.data})}
        />
        <ButtonComponent
          text={`Rp${props.price.toLocaleString("id")},-`}
          class="border sm:text-sm border-black bg-white cursor-default h-[45px] sm:h-auto text-xs"
          px="4"
          py="3"
        />
      </div>
    </div>
  );
}
