import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";

export default function LandingComponent() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen py-40">
      <div className="flex flex-col justify-center h-full px-24 space-y-7">
        <h1 className="lg:text-6xl lg:w-[60%] font-medium text-2xl">
          Order medicine for your health and wellness has never been easier
        </h1>
        <h6 className="text-base lg:w-[30%]">
          With SEHATBOS.COM, ordering medicine and supplements for your well being is only a few click away, making it easier and faster to get your medicine.
        </h6>
        <div className="flex items-center space-x-5">
          <div className="space-x-3">
            <ButtonComponent
              text="SHOP NOW"
              class="border-borderHijau border-y border-l bg-hijauBtn text-white font-semibold"
              py="3"
              px="8"
              brightness="90"
              onclick={() => navigate('/product', {state : { category : ''}})}
            />
            <ButtonComponent
              text="UPLOAD PRESCRIPTION"
              class="border-borderHijau border bg-hijauBtn text-white font-semibold"
              py='3' 
              px='4'
              brightness='90'
              onclick={()=> navigate('/prescription')}
            />
          </div>
        </div>
          <h1 className="font-semibold hidden sm:inline hover:underline cursor-pointer">
            CONSULT WITH OUR DOCTORS
          </h1>
      </div>
    </div>
  );
}
