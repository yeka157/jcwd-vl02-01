import React from 'react';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const PasswordForm = (props) => {

    const onShowPassword = () => {
        if (props.passType === 'password') {
            props.setPassType('text')
        } else {
            props.setPassType('password')
        }
    };

    const onShowConfirmPassword = () => {
        if (props.confirmType === 'password') {
            props.setConfirmType('text')
        } else {
            props.setConfirmType('password')
        }
    };

    return (
        <div>
            <div className="pt-2 ">
                <p className="pb=[4px] text-[16px]  font-semibold">Password</p>
                <InputGroup>
                    <Input
                        size="sm"
                        backgroundColor="white"
                        className="input-form"
                        pr="4.5rem"
                        type={props.passType}
                        placeholder="6+ Characters"
                        _placeholder={{ color: "grey" }}
                        _focusVisible={{ outline: `2px solid  ${props.passStrength == 'Wrong format' ? 'red' : '#87E4D8'}` }}
                        onChange={(e) => props.setPass(e.target.value)}
                        value={props.password}
                    />
                    <InputRightElement width="3rem" onClick={() => { props.setShowPassword(!props.showPass); onShowPassword() }}>
                        {
                            props.showPass ? <AiFillEyeInvisible className="cursor-pointer mb-[10px]" size={25} color="grey" /> : <AiFillEye className="cursor-pointer mb-[10px]" size={25} color="grey" />
                        }
                    </InputRightElement>
                </InputGroup>

                <div className="flex justify-between mt-2">
                    <div className={`w-[100px] h-[4px] ${props.passStrength === 'strong' ? 'bg-blue-500' : props.passStrength  === 'medium' ? 'bg-yellow-500' : props.passStrength === 'weak' ? 'bg-red-500' : 'bg-[#E2E8F0]'} `}></div>
                    <div className={`w-[100px] h-[4px] ${props.passStrength === 'strong' ? 'bg-blue-500' : props.passStrength  === 'medium' ? 'bg-yellow-500' : props.passStrength  === 'weak' ? 'bg-[#E2E8F0]' : 'bg-[#E2E8F0]'} `}></div>
                    <div className={`w-[100px] h-[4px] ${props.passStrength === 'strong' ? 'bg-blue-500' : props.passStrength  === 'medium' ? 'bg-[#E2E8F0]' : props.passStrength  === 'weak' ? 'bg-[#E2E8F0]' : 'bg-[#E2E8F0]'} `}></div>
                </div>
            </div>

            <div className="pt-4 ">
                <p className="pb=[4px] text-[16px]  font-semibold">Confirm Password</p>
                <InputGroup>
                    <Input
                        size="sm"
                        backgroundColor="white"
                        className="input-form rounded"
                        pr="4.5rem"
                        type={props.confirmType}
                        placeholder="Re-type password"
                        _focusVisible={{ outline: `2px solid  ${props.confirmIndicator == `Password doesn't match` ? 'red' : '#87E4D8'}` }}
                        onChange={(e) => props.setConfirm(e.target.value)}
                        value={props.confirm}

                    />
                    <InputRightElement width="3rem" onClick={() => { props.setShowConfirm(!props.showConfirm); onShowConfirmPassword() }}>
                        {
                            props.showConfirm ? <AiFillEyeInvisible className="cursor-pointer mb-[10px]" size={25} color="grey" /> : <AiFillEye className="cursor-pointer mb-[10px]" size={25} color="grey" />
                        }
                    </InputRightElement>
                </InputGroup>
            </div>
        </div>
    )
}

export default PasswordForm;