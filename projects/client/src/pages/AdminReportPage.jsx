import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from 'react-router-dom';
import { ImHistory } from 'react-icons/im';
import { VscGraphLine } from 'react-icons/vsc';

export default function AdminReportPage() {
    const navigate = useNavigate();

  return (
    <div className="bg-bgWhite min-h-screen py-5 px-5 lg:px-[10vw]">
      <div className="container mx-auto mt-[2.5vh]">
        <h1 className="font-bold text-lg text-hijauBtn text-center cursor-pointer" onClick={() => {
						navigate('/admin');
					}}>
          SEHATBOS.COM <span className="font-normal">| REPORT</span>
        </h1>
      </div>

      <div className="container mx-auto mt-[5vh] grid justify-items-start">
        <h1 className="font-bold text-lg">Report</h1>
        <Breadcrumb fontSize="xs" className="text-[rgb(49,53,65,0.75)]">
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink>Report</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className="container mx-auto mt-[5vh] justify-evenly items-center content-center flex flex-col lg:flex-row space-y-5 lg:space-y-0">
        <Box
          w="sm"
          borderWidth="1px"
          overflow="hidden"
          fontWeight="semibold"
          lineHeight="tight"
          className="py-[20px] hover:bg-borderHijau border-borderHijau text-center mx-2 bg-hijauBtn text-bgWhite cursor-pointer min-h-[50vh] min-w-[20vw] flex flex-col items-center justify-center space-y-5"
          onClick={() => navigate('/admin/report/stock')}
        >
            <h1>Stock History</h1>
            <ImHistory className="w-8 h-auto"/>
        </Box>
        <Box
          w="sm"
          borderWidth="1px"
          overflow="hidden"
          fontWeight="semibold"
          lineHeight="tight"
          className="py-[20px] hover:bg-borderHijau border-borderHijau text-center mx-2 bg-hijauBtn text-bgWhite cursor-pointer min-h-[50vh] min-w-[20vw] flex flex-col items-center justify-center space-y-5"
          onClick={() => navigate('/admin/report/sales')}
        >
            <h1>Sales Report</h1>
            <VscGraphLine className="w-8 h-auto"/>
        </Box>
      </div>
    </div>
  );
}
