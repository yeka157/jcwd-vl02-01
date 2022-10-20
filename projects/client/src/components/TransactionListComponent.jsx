import React, { useState } from 'react';
import { FiShoppingBag } from "react-icons/fi";
import { RiErrorWarningLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Badge } from "@chakra-ui/react";


const TransactionListComponent = (props) => {

    const navigate = useNavigate();
    return (
        <div>
            {
                !props.loading ?
                    <div className="my-3 border shadow rounded w-3/4 mx-auto p-6 bg-white ">
                        <div className="flex justify-between border-b pb-2">
                            <div className=" flex">
                                <div className="flex items-center mx-2">
                                    <FiShoppingBag />
                                </div>

                                <div className="flex items-center mx-2">
                                    <p>{new Date(props.getData.order_date).toLocaleDateString("en-GB", {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}</p>
                                </div>

                                <div className="flex items-center mx-2">
                                    <p>{props.getData.invoice}</p>
                                </div>
                            </div>

                            <div className='text-white'>
                                <Badge
                                    colorScheme={
                                        props.getData.transaction_status === 'Cancelled'
                                            ? 'red'
                                            : props.getData.transaction_status === 'Awaiting Admin Confirmation'
                                                ? 'purple'
                                                : props.getData.transaction_status.includes('Awaiting Payment')
                                                    ? 'blue'
                                                    : 'green'
                                    }
                                >
                                    <p className={`
                                    ${props.getData.transaction_status === 'Cancelled'
                                            ? 'text-red-500'
                                            : props.getData.transaction_status === 'Awaiting Admin Confirmation'
                                                ? 'text-purple-500'
                                                : props.getData.transaction_status.includes('Awaiting Payment')
                                                    ? 'text-blue-500'
                                                    : 'text-green-500'}
                                    
                                    `}>
                                        {props.getData.transaction_status}
                                    </p>
                                </Badge>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <div className="flex">
                                <div className="flex items-center">
                                    {
                                        props.getData.invoice.includes('/CSTM') ?
                                            <img className="w-[100px] p-3" src={`http://localhost:8000/${props.getData.doctor_prescription}`} alt="img_prod" />
                                            :
                                            <img className="w-[120px]" src={props.getData.transaction_detail[0].product_image.includes('http') ? props.getData.transaction_detail[0].product_image : `http://localhost:8000${props.getData.transaction_detail[0].product_image}`} alt="img_prod" />
                                    }
                                </div>

                                <div className="flex items-center row">
                                    {
                                        props.getData.invoice.includes('/CSTM') ?
                                            <div>
                                                <p>Doctor Prescription</p>
                                            </div>
                                            :
                                            <div>
                                                <p>{props.getData.transaction_detail[0].product_name}</p>
                                                {
                                                    props.getData.transaction_detail.length > 1 ?
                                                        <p className="text-muted text-[12px]">and {props.getData.transaction_detail.length - 1} more product</p>
                                                        :
                                                        null
                                                }
                                            </div>
                                    }
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="pr-6 pl-3">
                                    {
                                        !props.getData.invoice.includes('/CSTM') ?
                                            <div>
                                                <p>Total purchase</p>
                                                <p className="font-bold">Rp{props.getData.total_purchase.toLocaleString('id')},-</p>
                                            </div>
                                            :
                                            props.getData.total_purchase == null ?
                                                <div className='flex items-center'>
                                                    <div className='flex'>
                                                        <RiErrorWarningLine className='mt-1 mr-1' />
                                                        <p>Processed by Admin</p>
                                                    </div>
                                                </div>
                                                :
                                                <div>
                                                    <p>Total purchase</p>
                                                    <p className="font-bold">Rp{props.getData.total_purchase.toLocaleString('id')},-</p>
                                                </div>

                                    }
                                </div>

                            </div>
                        </div>

                        <div className="flex justify-end pr-6">
                            <p className=' pr-4 text-[20px] font-medium text-hijauBtn cursor-pointer' onClick={() => navigate(`/transaction_detail?transaction_id=${props.getData.transaction_id}`, { state: props.getData })}>See details</p>
                        </div>
                    </div> :
                    null
            }
        </div>

    )
};

export default TransactionListComponent;