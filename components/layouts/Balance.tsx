"use client";

import { Eye, EyeSlash } from "phosphor-react";
import React, { useState } from "react";

type BalanceProps ={
  withdraw? : boolean;
}

const Balance = ({ withdraw }: BalanceProps) => {
  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="h-[90%] flex justify-center items-center">
      <div
        className={`flex flex-col ${withdraw ? "items-start" : "items-center"}`}
      >
        <div
          className={`${
            withdraw ? "text-[#1F2024]" : "text-[#D5FFEB80]"
          } flex items-center gap-2 cursor-pointer`}
          onClick={() => setShowBalance(!showBalance)}
        >
          <p className="text-[#71727A]">Your NGN Balance</p>
          {showBalance ? <Eye size={16} /> : <EyeSlash size={16} />}
        </div>
        <h3
          className={`text-2xl ${
            withdraw ? "text-[#1F2024]" : "text-white"
          } font-bold font-source`}
        >
          {showBalance ? "N2,150,500" : "••••••••"}
        </h3>
      </div>
    </div>
  );
};

export default Balance;
