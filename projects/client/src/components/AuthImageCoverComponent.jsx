import React from "react";

const ImageCover = (props) => {

    return (
        <div className='hidden lg:block lg:w-[552px] border bg-cover bg-center ' style={{ backgroundImage: `url(${props.imageCover})` }}>
            <div className='bg-gradient-to-t  h-[100%] from-[black]'>
                <div id="register-tagline">
                    <h1 className='font-sans text-[24px] text-[#87E4D8] pl-[42px] pt-[44px]'>{props.tagLine1}</h1>
                    <h1 className='font-sans text-[32px] text-[#87E4D8] pl-[42px]'>{props.tagLine2}</h1>
                </div>
            </div>
        </div>
    )
}

export default ImageCover