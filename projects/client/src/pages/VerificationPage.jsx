import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { FaUserSlash } from "react-icons/fa";
import { BsPersonCheckFill } from "react-icons/bs";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, COOKIE_EXP } from '../helper';
import { userLogin } from '../slices/userSlice';
import { useDispatch } from 'react-redux';
import HeadComponent from "../components/HeadComponent";

const VerificationPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const verifCookie = Cookies.get('verifToken');

    useEffect(() => {
        if (params.token == verifCookie) {
            verification();
        }
    })

    const verification = async () => {
        try {
            let res = await axios.patch(API_URL + '/auth/verify_account', {}, {
                headers: {
                    'Authorization': `Bearer ${params.token}`
                }
            });

            if (res.data.success) {
                Cookies.set('sehatToken', res.data.token, { expires: COOKIE_EXP });
                delete res.data.token
                dispatch(userLogin(res.data.dataUser));
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <HeadComponent title={'SEHATBOS | Verification'} description={'Verification'} type={'website'}/>
            {
                params.token === verifCookie ?
                    <div>
                        <div className='h-screen w-screen flex items-center'>
                            <div className='mx-auto'>
                                <p className='text-center text-[32px] text-poppins'>Verification success </p>
                                <BsPersonCheckFill className='text-[130px] text-[#015D67] mx-auto my-[45px]' />
                                <p className='text-center  text-poppins'>Congratulation now you can transact on our site</p>
                                <button onClick={() => navigate('/')} class={`w-[200px] text-[16px]  bg-[#015D67] text-center ml-[70px] my-[40px] py-3 hover:bg-[#033e45]  text-white font-bold py-2 px-4`}>
                                    Get Products
                                </button>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='h-screen w-screen flex items-center'>
                        <div className='mx-auto'>
                            <p className='text-center text-[32px] text-poppins'>Oops verification failed</p>
                            <FaUserSlash className='text-[130px] text-[#015D67] mx-auto my-[45px]' />
                            <p className='text-center  text-poppins'>This email verification is invalid, try to request another email verification</p>
                        </div>
                    </div>
            }
        </div>
    )
}

export default VerificationPage;