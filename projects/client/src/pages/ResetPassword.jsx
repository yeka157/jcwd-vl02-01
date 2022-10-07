import react, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { API_URL } from '../helper';
import PasswordForm from '../components/PasswordFormComponent';
import { FaUserSlash } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import { AiOutlineKey } from "react-icons/ai";
import { Spinner, useToast } from '@chakra-ui/react'

const ResetPassword = () => {
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordType, setPasswordType] = useState('password')
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordValid, setPasswordValid] = useState(false);
    const [confirmPasswordType, setConfirmPasswordType] = useState('password');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassIndicator, setConfirmPassIndicator] = useState('indicator');
    const [confirPassValid, setConfirmPassValid] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const params = useParams();
    const resetCookie = Cookies.get('resetToken');
    const toast = useToast();

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


    const btnSubmit = async () => {
        try {
            if (passwordValid && confirPassValid) {
                let res = await axios.patch(API_URL + '/auth/reset_password', { password }, {
                    headers: {
                        'Authorization': `Bearer ${params.token}`
                    }
                });

                if (res.data.success) {
                    setPassword('');
                    setConfirmPassword('');
                    setSpinner(false);
                    setDisableBtn(false)
                    toast({
                        title: 'Reset Password success',
                        description: "Now you can login with new passwword",
                        status: 'success',
                        position: 'top',
                        duration: 4000,
                        isClosable: true,
                    });
                }


            } else {
                setSpinner(false);
                setDisableBtn(false)
                toast({
                    title: 'Error found',
                    description: "Please check your form and follow the suggest in it",
                    status: 'error',
                    position: 'top',
                    duration: 4000,
                    isClosable: true,
                });
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {
                params.token === resetCookie ?
                    <div className='h-screen w-screen flex items-center'>
                        <div className='mx-auto lg:h-[520px] lg:border lg:w-[420px] lg:p-[46px] lg:rounded-lg lg:shadow'>
                            <div>

                                <h1 className=" font-poppins font-bold mb-[24px] text-center text-[32px]">Reset Password</h1>
                                <AiOutlineKey className='text-[100px] mx-auto text-[#015D67]' />

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

                                <button onClick={() => { setSpinner(true); setDisableBtn(true); setTimeout(btnSubmit, 2000) }} disabled={disableBtn} class={`w-[312px] text-[16px] mt-[24px] bg-[#015D67] text-center ${disableBtn ? '' : 'hover:bg-[#033e45]'}  text-white font-bold py-2 px-4 `}>
                                    {spinner ? <Spinner size='sm' color="grey" /> : 'Submit'}
                                </button>

                                <p className="text-[12px] pt-2">
                                    <a className="text-blue-500 font-bold" href="/login">Login</a>
                                </p>
                            </div>

                        </div>
                    </div>
                    :
                    <div className='h-screen w-screen flex items-center'>
                        <div className='mx-auto'>
                            <p className='text-center text-[32px] text-poppins'>Oops password recovery failed</p>
                            <FaUserSlash className='text-[130px] text-[#015D67] mx-auto my-[45px]' />
                            <p className='text-center  text-poppins'>This email  is invalid, try to request another email to recover your password </p>
                        </div>
                    </div>
            }
        </div>
    )

}

export default ResetPassword;