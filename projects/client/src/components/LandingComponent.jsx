import React from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";

export default function LandingComponent() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen py-40">
      <div className="flex flex-col justify-center h-full px-24 space-y-7">
        <h1 className="lg:text-6xl lg:w-[60%] font-medium text-2xl">
          Holistic beauty and wellness essential oil based products
        </h1>
        <h6 className="text-sm lg:w-[30%]">
          Beauty Shot Iinija - tai revoliucija naturalaus grozio pasaulyje -
          tarsi efektyvi injekcija. Papildykite laseliu megstama krema.
        </h6>
        <div className="flex items-center space-x-5">
          <div>
            <ButtonComponent
              text="SHOP"
              class="border-borderHijau border-y border-l bg-hijauBtn text-white font-semibold"
              py="3"
              px="8"
              brightness="90"
              onclick={() => navigate('/product', {state : { category : ''}})}
            />
            <ButtonComponent
              text="&gt;"
              class="border-borderHijau border bg-hijauBtn text-white font-semibold"
              py='3' 
              px='4'
              brightness='90'
            />
          </div>
          <h1 className="font-semibold hidden sm:inline hover:underline cursor-pointer">
            CONSULT WITH OUR DOCTORS
          </h1>
        </div>
      </div>
    </div>
  );
}
