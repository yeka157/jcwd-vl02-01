import React, { useState, useEffect } from "react";
import { Input, InputGroup, InputLeftElement, useToast, Spinner } from '@chakra-ui/react'
import { API_URL, COOKIE_EXP } from '../helper/index';
import PasswordForm from '../components/PasswordFormComponent';
import ImageCover from '../components/AuthImageCoverComponent';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from '../components/NavbarComponent';

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
    const [passwordValid, setPasswordValid] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [passwordType, setPasswordType] = useState('password')
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPassIndicator, setConfirmPassIndicator] = useState('indicator');
    const [confirmPassValid, setConfirmPassValid] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPasswordType, setConfirmPasswordType] = useState('password');
    const [usersData, setUsersData] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);


    const toast = useToast();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const getUsers = await axios.get(API_URL + '/auth/get_all_users');
            setUsersData(getUsers.data);

        } catch (error) {
            console.log(error);
        }
    }

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
            if (phoneNumber.length > 9) {
                if (findPhoneNumber < 0) {
                    setPhoneIndicator('indicator')
                    setPhoneValid(true)
                } else {
                    setPhoneIndicator('Phone number already exist');
                    setPhoneValid(false);
                }
            } else {
                setPhoneIndicator('Wrong format');
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
                    setPasswordValid(true);
                } else if (password.match(passwordChecker)) {
                    console.log('medium');
                    setPasswordStrength('medium');
                    setPasswordValid(true);
                } else {
                    console.log('weak');
                    setPasswordStrength('weak');
                    setPasswordValid(true);
                }
            } else {
                console.log('no match');
                setPasswordStrength('Wrong format');
                setPasswordValid(false);
            }

        } else {
            setPasswordStrength('indicator');
            setPasswordValid(false);

        }


    }, [password])

    useEffect(() => {
        if (confirmPassword) {
            if (password === confirmPassword) {
                setConfirmPassIndicator('indicator')
                setConfirmPassValid(true)
            } else {
                setConfirmPassIndicator(`Password doesn't match`);
                setConfirmPassValid(false);
            }
        } else {
            setConfirmPassIndicator('indicator');
            setConfirmPassValid(false);
        }
    }, [password, confirmPassword])

    const btnRegister = async () => {
        try {
            if (usernameValid && emailValid && phoneValid && passwordValid && confirmPassValid) {
                let register = await axios.post(API_URL + '/auth/register', {
                    username,
                    email,
                    phone_number: phoneNumber,
                    password
                });

                getData();

                if (register.data.success) {

                    setUsername('');
                    setEmail('');
                    setPhoneNumber('');
                    setPassword('');
                    setConfirmPassword('');
                    setSpinner(false);
                    setDisableBtn(false);
                    // additional APKG1-4
                    Cookies.set('verifToken', register.data.token, { expires: COOKIE_EXP });
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
                setDisableBtn(false);
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
            <div className='h-screen w-screen lg:w-3/4 pt-[220px] pb-1 lg:pt-[175px] lg:pb-[80px] mx-auto flex items-center'>
                <div className='flex bg-white lg:border mx-auto lg:drop-shadow-xl'>
                    <ImageCover
                        imageCover={"https://images.unsplash.com/photo-1555633514-abcee6ab92e1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cGhhcm1hY3l8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"}
                        tagLine1={"Let us help you to"}
                        tagLine2={"meet your medicine needs"}
                    />
                    <div className="mx-auto p-[32px] w-screen h-screen lg:h-[660px] lg:w-[460px]">
                        <div className="mx-auto lg:px-[42px] lg:pt-[18px]">
                            <h1 className="font-poppins font-bold font-poppins text-[32px]">Register</h1>

                            <div className="pt-2">
                                <p className="pb=[4px] text-[16px] font-semibold">Username</p>
                                <Input
                                    size="sm"
                                    _focusVisible={{ outline: `2px solid ${usernameIndicator != 'indicator' ? 'red' : '#87E4D8'} ` }}
                                    backgroundColor="white"
                                    color='#24292f'
                                    pr="4.5rem"
                                    type='text'
                                    placeholder="5+ Characters"
                                    _placeholder={{ color: "grey" }}
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                />
                                <p className={`text-[12px] pl-[2px] ${usernameIndicator != 'Username already exist' ? 'text-white' : 'text-red-500'}`}>{usernameIndicator}</p>
                            </div>

                            <div className="pt-2 ">
                                <p className="pb=[4px] text-[16px]  font-semibold">Email</p>
                                <Input
                                    size="sm"
                                    _focusVisible={{ outline: `2px solid ${emailIndicator != 'indicator' ? 'red' : '#87E4D8'}` }}
                                    backgroundColor="white"
                                    pr="4.5rem"
                                    type={'email'}
                                    placeholder="sehat@mail.com"
                                    _placeholder={{ color: "grey" }}
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                                <p className={`text-[12px] pl-[2px] ${emailIndicator != 'Email already exist' ? 'text-white' : 'text-red-500'}`}>{emailIndicator}</p>
                            </div>

                            <div className="pt-2">
                                <p className="pb=[4px] text-[16px]  font-semibold">Phone Number</p>
                                <InputGroup>
                                    <InputLeftElement>
                                        <p className="font-semi text-[15px] text-[#565656] pb-2 pr-1 border-r">+62</p>
                                    </InputLeftElement>

                                    <Input
                                        size="sm"
                                        _focusVisible={{ outline: `2px solid  ${phoneIndicator != 'indicator' ? 'red' : '#87E4D8'}` }}
                                        backgroundColor="white"
                                        pr="4.5rem"
                                        type={'number'}
                                        placeholder=" xxx xxx xxx"
                                        _placeholder={{ color: "grey" }}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        value={phoneNumber}
                                    />
                                </InputGroup>

                                <p className={`text-[12px] pl-[2px] ${phoneIndicator != 'Phone number already exist' ? 'text-white' : 'text-red-500'}`}>{phoneIndicator}</p>
                            </div>

                            <PasswordForm
                                label={'Password'}
                                password={password}
                                setPass={setPassword}
                                passType={passwordType}
                                setPassType={setPasswordType}
                                setShowPassword={setShowPassword}
                                passStrength={passwordStrength}
                                showPass={showPassword}
                                confirm={confirmPassword}
                                setConfirm={setConfirmPassword}
                                confirmType={confirmPasswordType}
                                setConfirmType={setConfirmPasswordType}
                                confirmIndicator={confirmPassIndicator}
                                showConfirm={showConfirmPassword}
                                setShowConfirm={setShowConfirmPassword}
                            />

                            <div className="pt-[24px]">
                                {/* Additional APKG1-4 */}
                                <button onClick={() => { setSpinner(true); setTimeout(btnRegister, 2000); setDisableBtn(true) }} disabled={disableBtn} class={`w-[312px] text-[16px] bg-[#015D67] hover:bg-brightness-90 text-center ${disableBtn ? '' : 'bg-brightness-90'}  text-white font-bold py-2 px-4 `}>
                                    {spinner ? <Spinner size='sm' color="grey" /> : 'Create Account'}
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
