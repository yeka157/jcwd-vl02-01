import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
// import { HiOutlineBuildingStorefront } from 'react-icons/hi';
import { ImUsers } from 'react-icons/im';
import { GrMoney } from 'react-icons/gr';
import { FaBoxOpen } from 'react-icons/fa';
export default function AdminSalesReportPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-bgWhite min-h-screen py-5 px-5 lg:px-[10vw]">
      <div className="container mx-auto mt-[2.5vh]">
        <h1 className="font-bold text-lg text-hijauBtn text-center">
          SEHATBOS.COM <span className="font-normal">| SALES REPORT</span>
        </h1>
      </div>
      <div className="container mx-auto mt-[5vh] grid justify-items-start">
        <h1 className="font-bold text-lg">Sales Report</h1>
        <Breadcrumb fontSize="xs" className="text-[rgb(49,53,65,0.75)]">
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/report">Report</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink>Sales Report</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-5 mx-auto text-center gap-10">
        <div
          className="min-h-[50vh] flex flex-col items-center justify-center bg-[rgb(2,93,103,0.1)] text-2xl font-medium cursor-pointer hover:brightness-200"
          onClick={() => {
            navigate("/admin/report/sales/product");
          }}
        >
          PRODUCT REPORT
          <FaBoxOpen className="w-8 h-auto my-5"/>
        </div>
        <div
          className="min-h-[50vh] flex flex-col items-center justify-center bg-[rgb(2,93,103,0.1)] text-2xl font-medium cursor-pointer hover:brightness-200"
          onClick={() => {
            navigate("/admin/report/sales/transaction");
          }}
        >
          TRANSACTION REPORT
          <GrMoney className="w-8 h-auto my-5"/>
        </div>
        <div
          className="min-h-[50vh] flex flex-col items-center justify-center bg-[rgb(2,93,103,0.1)] text-2xl font-medium cursor-pointer hover:brightness-200"
          onClick={() => {
            navigate("/admin/report/sales/user");
          }}
        >
          USER REPORT
          <ImUsers className="w-8 h-auto my-5"/>
        </div>
      </div>
    </div>
  );
}
