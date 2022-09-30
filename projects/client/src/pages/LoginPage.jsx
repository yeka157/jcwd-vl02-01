import React, { useEffect } from "react";
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
import { API_URL, COOKIE_EXP } from '../helper/index';
import axios from 'axios';
import Cookies from "js-cookie";
import { userLogin } from '../slices/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMail } from "react-icons/hi";
import ImageCover from "../components/AuthImageCoverComponent";
import Navbar from "../components/NavbarComponent";

const LoginPage = () => {

    const [credential, setCredential] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordType, setPasswordType] = useState('password');
    const [emailRecovery, setEmailRecovery] = useState('');
    const [emailRecoveryStatus, setEmailRecoveryStatus] = useState(true);
    const [usersData, setUsersData] = useState([]);
    const [disableBtn, setDisableBtn] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        try {
            const getUsers = await axios.get(API_URL + '/auth/get_all_users');
            setUsersData(getUsers.data);

        } catch (error) {
            console.log(error);
        }
    }

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
                Cookies.set('sehatToken', resUser.data.token, { expires: COOKIE_EXP });
                delete resUser.data.token
                dispatch(userLogin(resUser.data.dataUser));
                setDisableBtn(false);
                setSpinner(false);

                if (resUser.data.dataUser.role === 'CUSTOMER') {
                    navigate('/');
                } else {
                    navigate('/admin');
                }
            };

        } catch (error) {
            setDisableBtn(false);
            setSpinner(false);
            toast({
                title: 'Error found',
                description: "Please check your email or username and password ",
                status: 'error',
                position: 'top',
                duration: 4000,
                isClosable: true,
            })
        }
    };

    const btnSendPasswordRecovery = async () => {
        try {
            let findIdx = usersData.findIndex(val => val.email === emailRecovery);

            if (findIdx >= 0 && emailRecovery) {

                let res = await axios.post(API_URL + '/auth/send_reset_password', {
                    email: emailRecovery
                })

                console.log(res.data.token);

                if (res.data.success) {
                    onClose();
                    setEmailRecoveryStatus(true);
                    setEmailRecovery('');
                    Cookies.set('resetToken', res.data.token, { expires: COOKIE_EXP });
                    toast({
                        title: 'Email has been sent',
                        description: "Please check your email box",
                        status: 'success',
                        position: 'top',
                        duration: 4000,
                        isClosable: true,
                    })
                }

            } else {
                setEmailRecoveryStatus(false);
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Navbar/>
            <div className='h-screen w-screen lg:w-3/4 lg:h-[670px] mx-auto lg:mt-[64px] flex items-center'>
                <div className='flex bg-white lg:border mx-auto drop-shadow-xl' >

                    <ImageCover
                        imageCover={"https://images.unsplash.com/photo-1563213126-a4273aed2016?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"}
                        tagLine1={"We handle it profesionally"}
                        tagLine2={"it is much beyond prescriptions"}
                    />

                    <div className="mx-auto p-[32px] w-screen h-screen lg:h-[660px] lg:w-[460px]">
                        <div className="mx-auto lg:px-[42px] lg:pt-[18px]">
                            <h1 className="font-poppins font-bold font-poppins text-[32px]">Login</h1>

                            <div className="pt-2">
                                <p className="pb=[4px] text-[16px] font-semibold">Username or email</p>
                                <Input
                                    size="sm"
                                    _focusVisible={{ outline: '2px solid  #87E4D8' }}
                                    backgroundColor="white"
                                    pr="4.5rem"
                                    type={'text'}
                                    placeholder="Username"
                                    _placeholder={{ color: "grey" }}
                                    onChange={(e) => setCredential(e.target.value)}
                                    value={credential}
                                />
                            </div>


                            <div className="pt-4 ">
                                <p className="pb=[4px] text-[16px]  font-semibold">Password</p>
                                <InputGroup>
                                    <Input
                                        size="sm"
                                        backgroundColor="white"
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
                                <button onClick={() => { setTimeout(btnLogin, 2000); setDisableBtn(true); setSpinner(true) }} disabled={disableBtn} class={`w-[312px] text-[16px]  bg-[#015D67] text-center ${disableBtn ? '' : 'hover:bg-brightness-90'}  text-white font-bold py-2 mt-3 px-4 `}>
                                    {spinner ? <Spinner size='sm' color="grey" /> : 'Login'}
                                </button>

                                <p className="text-[12px] pt-2">
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
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl mt={4}>

                            <div className="text-center mt-[34px]">
                                <p className="text-grey text-[14px]"> Pleaes insert your email here, make sure your email is correct</p>
                                <HiOutlineMail className="mx-auto text-center text-[120px] text-[#015D67]" />
                            </div>

                            <Input
                                placeholder='Email'
                                backgroundColor="white"
                                pr="4.5rem"
                                type='text'
                                _placeholder={{ color: "grey" }}
                                _focusVisible={{ outline: '2px solid #87E4D8' }}
                                onChange={(e) => setEmailRecovery(e.target.value)}
                                value={emailRecovery}
                            />
                        </FormControl>
                        {!emailRecoveryStatus ? <p className="text-red-500 text-[14px]">Email not found</p> : <p className="text-white text-[14px]">Dumy text</p>}

                    </ModalBody>

                    <ModalFooter>
                        <button className="bg-[#015D67] px-5 py-2 text-white font-bold rounded mx-1" onClick={btnSendPasswordRecovery}>
                            Send
                        </button>
                        <Button onClick={() => { setEmailRecoveryStatus(true); onClose(); setEmailRecovery('') }}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default LoginPage;