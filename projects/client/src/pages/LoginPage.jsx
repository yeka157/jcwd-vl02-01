import React from "react";
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useState } from "react";


const LoginPage = () => {

    const [credential, setCredential] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordType, setPasswordType] = useState('password')

    const onShowPassword = () => {
        if (passwordType === 'password') {
            setPasswordType('text')
        } else {
            setPasswordType('password')
        }
    };



    return (
        <div>
            <div className='h-screen flex items-center '>
                <div className='flex h-screen lg:h-[75vh] w-full lg:w-[55%] bg-white border mx-auto rounded-lg drop-shadow-xl ' >
                    <div className='flex-initial hidden lg:block w-[55%] border bg-cover bg-center rounded-l-lg' style={{ backgroundImage: `url("https://images.unsplash.com/photo-1583088580009-2d947c3e90a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHBoYXJtYWN5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60")` }}>
                        <div className='bg-gradient-to-t  h-[100%] from-[black] rounded-l-lg'>
                            <div id="register-tagline">
                                <h1 className='font-sans text-[24px] text-[#87E4D8] pl-[42px] pt-[44px]'>We handle it profesionally</h1>
                                <h1 className='font-sans text-[32px] text-[#87E4D8] pl-[42px]'>it is much beyond prescriptions</h1>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto">
                        <div className="px-[68px] pt-[42px] mx-auto">
                            <h1 className="font-poppins font-bold text-[36px]">Login</h1>

                            <div className="pt-2">
                                <p className="pb=[4px]  font-semibold">Email or username</p>
                                <Input
                                    size="sm"
                                    _focusVisible={{ outline: '2px solid  #87E4D8' }}
                                    backgroundColor="white"
                                    className="input-form"
                                    value={credential}
                                    pr="4.5rem"
                                    type={'email'}
                                    placeholder="Username"
                                    _placeholder={{ color: "grey" }}
                                    onChange={(e) => setCredential(e.target.value)}
                                />
                            </div>


                            <div className="pt-5 ">
                                <p className="pb=[4px] font-semibold">Password</p>
                                <InputGroup>
                                    <Input
                                        size="sm"
                                        backgroundColor="white"
                                        _focusVisible={{ outline: '2px solid  #87E4D8' }}
                                        className="input-form"
                                        pr="4.5rem"
                                        type={passwordType}
                                        value={password}
                                        placeholder="Password"
                                        _placeholder={{ color: "grey" }}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <InputRightElement width="3rem" onClick={()=> {onShowPassword(); setShowPassword(!showPassword) }}>
                                        {
                                            showPassword ? <AiFillEyeInvisible className="cursor-pointer mb-[10px]" size={25} color="grey" /> : <AiFillEye className="cursor-pointer mb-[10px]" size={25} color="grey" />
                                        }
                                    </InputRightElement>
                                </InputGroup>
                            </div>


                            <div className="pt-[24px]">
                                <button class="w-[332px] bg-[#87E4D8] text-center hover:bg-[#97E4D8] text-white font-bold py-2 px-4 rounded-full text-black">
                                    Login
                                </button>

                                <p className="text-[12px] pl-3 pt-2">
                                    Create account? <a className="text-blue-500 font-bold" href="/register">Register</a>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;