"use client";

import Balance from "@/components/layouts/Balance";
import React from "react";
import BankDetailsList from "../ui/BankDetailsList";

const Hero = () => {
  return (
    <div className="px-4 md:px-8 py-4 md:py-6">
      <div>
        <p className="text-sm text-[#71727A] font-source">
          Admin / withdraw_history
        </p>
        <h2 className="font-bold text-2xl">Your Account</h2>
      </div>

      <div className="md:flex w-[100%] justify-between items-center">
        <div className="flex flex-col gap-12 py-4">
          <div className="max-w-[200px] flex flex-col items-start">
            <div className="">
              <Balance withdraw />
            </div>
            <button className="font-semibold text-white md:text-sm text-xs bg-[#FF5B00] px-2 py-1 font-source rounded-full border border-[#FF5B00] mt-2">
              Withdraw
            </button>
          </div>

          <p className="font-source text-sm text-[#71727A] hidden md:block">
            Last Updated October 10, 2024
          </p>
        </div>

        <div className=" md:w-[70%] lg:px-10">
          <div className="flex gap-1 items-center">
            <h2 className="font-bold text-2xl">Bank Details</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#000000"
              viewBox="0 0 256 256"
            >
              <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
            </svg>{" "}
          </div>

          <div>
            <BankDetailsList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
