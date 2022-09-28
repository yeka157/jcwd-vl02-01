import React, { useState, useEffect } from "react";
import { Input, InputGroup, InputRightElement, useToast, Spinner } from '@chakra-ui/react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { API_URL } from '../helper/index';
import axios from 'axios';
import Cookies from 'js-cookie'

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [usernameIndicator, setUsernameIndicator] = useState('indicator');
    const [usernameValid, setUsernameValid] = useState(false);
    const [email, setEmail] = useState('');
    const [emailIndicator, setEmailIndicator] = useState('indicator');
    const [emailValid, setEmailValid] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneIndicator, setPhoneIndicator] = useState('indicator');
    const [phoneValid, setPhoneValid] = useState(false)
    const [password, setPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordValid, setpasswordValid] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [passwordType, setPasswordType] = useState('password')
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPassIndicator, setConfirmPassIndicator] = useState('indicator');
    const [confirmPassValid, setConfirmPasslValid] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPasswordType, setConfirmPasswordType] = useState('password');
    const [usersData, setUsersData] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);


    const toast = useToast();

    useEffect(() => {
        const getData = async () => {
            try {
                const getUsers = await axios.get(API_URL + '/auth/get_all_users');
                setUsersData(getUsers.data);

            } catch (error) {
                console.log(error);
            }
        }

        getData();

    }, [])

    useEffect(() => {
        let findUsername = usersData.findIndex(val => val.username === username);

        if (username) {
            if (username.length >= 5) {
                if (findUsername < 0) {
                    setUsernameIndicator('indicator')
                    setUsernameValid(true)
                } else {
                    setUsernameIndicator('Username already exist');
                    setUsernameValid(false);
                }
            } else {
                setUsernameIndicator('Atleast five characters ');
                setUsernameValid(false);
            }

        } else {
            setUsernameIndicator('indicator')
            setUsernameValid(false)
        }

    }, [username]);

    useEffect(() => {
        let findPhoneNumber = usersData.findIndex(val => val.phone_number === phoneNumber);

        if (phoneNumber) {
            if (findPhoneNumber < 0) {
                setPhoneIndicator('default text')
                setPhoneValid(true)
            } else {
                setPhoneIndicator('Phone number already exist');
                setPhoneValid(false);
            }
        } else {
            setPhoneValid(false)
        }

    }, [phoneNumber]);

    useEffect(() => {
        let findEmail = usersData.findIndex(val => val.email === email);

        if (email) {
            if (email.includes('@' && '.co')) {
                if (findEmail < 0) {
                    setEmailIndicator('indicator')
                    setEmailValid(true)
                } else {
                    setEmailIndicator('Email already exist');
                    setEmailValid(false);
                }
            } else {
                setEmailIndicator('Use email format');
                setEmailValid(false);
            }

        } else {
            setEmailIndicator('indicator')
            setEmailValid(false)
        }

    }, [email]);

    useEffect(() => {
        const passwordChecker = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/;
        const strongPasswordChecker = /^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){2,}).{8,}$/
        if (password) {
            if (password.length >= 6) {
                if (password.match(strongPasswordChecker)) {
                    setPasswordStrength('strong');
                    console.log('strong');
                    setpasswordValid(true);
                } else if (password.match(passwordChecker)) {
                    console.log('medium');
                    setPasswordStrength('medium');
                    setpasswordValid(true);
                } else {
                    console.log('weak');
                    setPasswordStrength('weak');
                    setpasswordValid(true);
                }
            } else {
                console.log('no match');
                setPasswordStrength('weak');
                setpasswordValid(false);
            }

        } else {
            setPasswordStrength('');
            setpasswordValid(false);

        }


    }, [password])

    useEffect(() => {
        if (confirmPassword) {
            if (password === confirmPassword) {
                setConfirmPassIndicator('indicator')
                setConfirmPasslValid(true)
            } else {
                setConfirmPassIndicator(`Password doesn't match`);
                setConfirmPasslValid(false);
            }
        } else {
            setConfirmPassIndicator('indicator');
            setConfirmPasslValid(false);
        }
    }, [password, confirmPassword])

    const onShowPassword = () => {
        if (passwordType === 'password') {
            setPasswordType('text')``
        } else {
            setPasswordType('password')
        }
    };

    const onShowConfirmPassword = () => {
        if (confirmPasswordType === 'password') {
            setConfirmPasswordType('text')
        } else {
            setConfirmPasswordType('password')
        }
    };

    const btnRegister = async () => {
        try {
            if (usernameValid && emailValid && phoneValid && passwordValid && confirmPassValid) {
                let register = await axios.post(API_URL + '/auth/register', {
                    username,
                    email,
                    phone_number: phoneNumber,
                    password
                });


                if (register.data.success) {
                    setUsername('');
                    setEmail('');
                    setPhoneNumber('');
                    setPassword('');
                    setConfirmPassword('');
                    setSpinner(false);
                    setDisableBtn(false);
                    // additional APKG1-4
                    Cookies.set('verifToken', register.data.token, {expires: 2});
                    toast({
                        title: 'Account created.',
                        description: "Please check email to verify your account.",
                        status: 'success',
                        position: 'top',
                        duration: 4000,
                        isClosable: true,
                    })
                }

            } else {
                setSpinner(false)
                toast({
                    title: 'Register fail',
                    description: "Please check your form and the suggest in it",
                    status: 'error',
                    position: 'top',
                    duration: 4000,
                    isClosable: true,
                })
            }
        } catch (error) {
            console.log('error');
        }
    }


    return (
        <div>
            <div className='h-screen w-screen flex items-center '>
                <div className='flex bg-white lg:border mx-auto lg:rounded-lg drop-shadow-xl ' >
                    <div className='hidden lg:block lg:w-[552px] border bg-cover bg-center rounded-l-lg' style={{ backgroundImage: `url("https://images.unsplash.com/photo-1555633514-abcee6ab92e1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cGhhcm1hY3l8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60")` }}>
                        <div className='bg-gradient-to-t  h-[100%] from-[black] rounded-l-lg'>
                            <div id="register-tagline">
                                <h1 className='font-sans text-[24px] text-[#87E4D8] pl-[42px] pt-[44px]'>Let us help you to</h1>
                                <h1 className='font-sans text-[32px] text-[#87E4D8] pl-[42px]'>meet your medicine needs.</h1>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto p-[32px] w-screen h-screen lg:h-[660px] lg:w-[460px]">
                        <div className="mx-auto lg:px-[42px] lg:pt-[18px]">
                            <h1 className="font-poppins font-bold font-poppins text-[32px]">Register</h1>

                            <div className="pt-2">
                                <p className="pb=[4px] text-[16px] font-semibold">Username</p>
                                <Input
                                    size="sm"
                                    _focusVisible={{ outline: '2px solid  #87E4D8' }}
                                    backgroundColor="white"
                                    className="input-form"
                                    pr="4.5rem"
                                    type={'email'}
                                    placeholder="Username"
                                    _placeholder={{ color: "grey" }}
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                />
                                <p className={`text-[12px] pl-[2px] ${usernameIndicator != 'indicator' ? 'text-red-500' : 'text-white'}`}>{usernameIndicator}</p>
                            </div>

                            <div className="pt-2 ">
                                <p className="pb=[4px] text-[16px]  font-semibold">Email</p>
                                <Input
                                    size="sm"
                                    _focusVisible={{ outline: '2px solid  #87E4D8' }}
                                    backgroundColor="white"
                                    className="input-form"
                                    pr="4.5rem"
                                    type={'email'}
                                    placeholder="sehat@mail.com"
                                    _placeholder={{ color: "grey" }}
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                                <p className={`text-[12px] pl-[2px] ${emailIndicator != 'indicator' ? 'text-red-500' : 'text-white'}`}>{emailIndicator}</p>
                            </div>

                            <div className="pt-2">
                                <p className="pb=[4px] text-[16px]  font-semibold">Phone Number</p>
                                <Input
                                    size="sm"
                                    _focusVisible={{ outline: '2px solid  #87E4D8' }}
                                    backgroundColor="white"
                                    className="input-form"
                                    pr="4.5rem"
                                    type={'number'}
                                    placeholder="+62 xxx xxx xxx"
                                    _placeholder={{ color: "grey" }}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    value={phoneNumber}
                                />
                                <p className={`text-[12px] pl-[2px] ${phoneIndicator === 'Phone number already exist' ? 'text-red-500' : 'text-white'}`}>{phoneIndicator}</p>
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

                                <div className="flex justify-between mt-2">
                                    <div className={`w-[100px] h-[4px] ${passwordStrength === 'strong' ? 'bg-blue-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : passwordStrength === 'weak' ? 'bg-red-500' : 'bg-[#E2E8F0]'} `}></div>
                                    <div className={`w-[100px] h-[4px] ${passwordStrength === 'strong' ? 'bg-blue-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : passwordStrength === 'weak' ? 'bg-[#E2E8F0]' : 'bg-[#E2E8F0]'} `}></div>
                                    <div className={`w-[100px] h-[4px] ${passwordStrength === 'strong' ? 'bg-blue-500' : passwordStrength === 'medium' ? 'bg-[#E2E8F0]' : passwordStrength === 'weak' ? 'bg-[#E2E8F0]' : 'bg-[#E2E8F0]'} `}></div>
                                </div>
                            </div>

                            <div className="pt-2 ">
                                <p className="pb=[4px] text-[16px]  font-semibold">Confirm Password</p>
                                <InputGroup>
                                    <Input
                                        size="sm"
                                        backgroundColor="white"
                                        className="input-form rounded"
                                        pr="4.5rem"
                                        type={confirmPasswordType}
                                        placeholder="Password"
                                        _focusVisible={{ outline: '2px solid #87E4D8' }}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        value={confirmPassword}

                                    />
                                    <InputRightElement width="3rem" onClick={() => { setShowConfirmPassword(!showConfirmPassword); onShowConfirmPassword() }}>
                                        {
                                            showConfirmPassword ? <AiFillEyeInvisible className="cursor-pointer mb-[10px]" size={25} color="grey" /> : <AiFillEye className="cursor-pointer mb-[10px]" size={25} color="grey" />
                                        }
                                    </InputRightElement>
                                </InputGroup>
                                <p className={`text-[12px] pl-[2px] ${confirmPassIndicator != 'indicator' ? 'text-red-500' : 'text-white'}`}>{confirmPassIndicator}</p>
                            </div>

                            <div className="pt-[16px]">
                            {/* Additional APKG1-4 */}
                                <button onClick={() => {setSpinner(true); setTimeout(btnRegister, 2000); setDisableBtn(true)}} disabled={disableBtn}  class={`w-[312px] text-[16px]  bg-[#015D67] text-center ${disableBtn ? '' : 'hover:bg-[#033e45]' }  text-white font-bold py-2 px-4 rounded-full`}>
                                    {spinner ? <Spinner size='sm' color="grey"/> : 'Create Account' }
                                </button>

                                <p className="text-[12px] pl-3 pt-2">
                                    Already have account? <a className="text-blue-500 font-bold" href="/login">Login</a>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default RegisterPage;