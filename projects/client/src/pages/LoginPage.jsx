import React from "react";
import {
    Button,
    Input,
    InputGroup,
    InputRightElement,
    Spinner,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useState } from "react";
import { API_URL } from '../helper/index';
import axios from 'axios';
import Cookies from "js-cookie";
import { userLogin } from '../slices/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {

    const [credential, setCredential] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordType, setPasswordType] = useState('password');
    const [emailRecovery, setEmailRecovery] = useState('');
    const [disableBtn, setDisableBtn] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const onShowPassword = () => {
        if (passwordType === 'password') {
            setPasswordType('text')
        } else {
            setPasswordType('password')
        }
    };

    const btnLogin = async () => {
        try {
            let resUser = await axios.post(API_URL + '/auth/login', {
                credential,
                password
            });

            if (resUser.data.success) {
                Cookies.set('sehatToken', resUser.data.token, { expires: 2 });
                delete resUser.data.token
                dispatch(userLogin(resUser.data.dataUser));
                navigate('/')
            };

        } catch (error) {
            toast({
                title: 'Error found',
                description: "Please check your email or username and password ",
                status: 'error',
                position: 'top',
                duration: 4000,
                isClosable: true,
            })

        }
    }


    return (
        <div>
            <div className='h-screen w-screen flex items-center '>
                <div className='flex bg-white lg:border mx-auto lg:rounded-lg drop-shadow-xl' >
                    <div className='hidden lg:block lg:w-[552px] border bg-cover bg-center rounded-l-lg' style={{ backgroundImage: `url("https://images.unsplash.com/photo-1563213126-a4273aed2016?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")` }}>
                        <div className='bg-gradient-to-t  h-[100%] from-[black] rounded-l-lg'>
                            <div id="register-tagline">
                                <h1 className='font-sans text-[24px] text-[#87E4D8] pl-[42px] pt-[44px]'>We handle it profesionally</h1>
                                <h1 className='font-sans text-[32px] text-[#87E4D8] pl-[42px]'>it is much beyond prescriptions</h1>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto p-[32px] w-screen h-screen lg:h-[660px] lg:w-[460px]">
                        <div className="mx-auto lg:px-[42px] lg:pt-[18px]">
                            <h1 className="font-poppins font-bold font-poppins text-[32px]">Login</h1>

                            <div className="pt-2">
                                <p className="pb=[4px] text-[16px] font-semibold">Username or email</p>
                                <Input
                                    size="sm"
                                    _focusVisible={{ outline: '2px solid  #87E4D8' }}
                                    backgroundColor="white"
                                    className="input-form"
                                    pr="4.5rem"
                                    type={'email'}
                                    placeholder="Username"
                                    _placeholder={{ color: "grey" }}
                                    onChange={(e) => setCredential(e.target.value)}
                                    value={credential}
                                />
                            </div>


                            <div className="pt-2 ">
                                <p className="pb=[4px] text-[16px]  font-semibold">Password</p>
                                <InputGroup>
                                    <Input
                                        size="sm"
                                        backgroundColor="white"
                                        className="input-form"
                                        pr="4.5rem"
                                        type={passwordType}
                                        placeholder="6+ Characters"
                                        _placeholder={{ color: "grey" }}
                                        _focusVisible={{ outline: '2px solid #87E4D8' }}
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                    />
                                    <InputRightElement width="3rem" onClick={() => { setShowPassword(!showPassword); onShowPassword() }}>
                                        {
                                            showPassword ? <AiFillEyeInvisible className="cursor-pointer mb-[10px]" size={25} color="grey" /> : <AiFillEye className="cursor-pointer mb-[10px]" size={25} color="grey" />
                                        }
                                    </InputRightElement>
                                </InputGroup>

                                <p className="text-[10px] py-1 " onClick={onOpen}>
                                    Forgot password? <a className="text-blue-500 font-bold pointer-cursor" >Click here</a>
                                </p>

                            </div>

                            <div className="pt-[16px]">
                                {/* Additional APKG1-4 */}
                                <button onClick={() => { btnLogin() }} disabled={disableBtn} class={`w-[312px] text-[16px]  bg-[#015D67] text-center ${disableBtn ? '' : 'hover:bg-[#033e45]'}  text-white font-bold py-2 px-4 rounded-full`}>
                                    {spinner ? <Spinner size='sm' color="grey" /> : 'Login'}
                                </button>

                                <p className="text-[12px] pl-3 pt-2">
                                    Don't have account yet? <a className="text-blue-500 font-bold" href="/register">Register</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Recovery Modal */}
            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Password recovery</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl mt={4}>
                            <FormLabel>Insert your email here</FormLabel>
                            <Input
                                placeholder='Email'
                                backgroundColor="white"
                                className="input-form"
                                pr="4.5rem"
                                type='text'
                                _placeholder={{ color: "grey" }}
                                _focusVisible={{ outline: '2px solid #87E4D8' }} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <button className="bg-[#015D67] px-5 py-2 text-white font-bold rounded mx-1">
                            Send
                        </button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default LoginPage;