import React from "react";

type Item = {
  header: string;
  details: string;
};

const bankDetails: Item[] = [
  { header: "Account Holder Name", details: "Flend Worldwide Ltd." },
  { header: "Bank Name", details: "Global Bank Inc." },
  { header: "Account Number/IBAN", details: "1234567890" },
  { header: "Branch Code", details: "00123" },
  { header: "SWIFT/BIC Code", details: "GBINUS33" },
];

const BankDetailsList = () => {
  return (
    <div>
      {bankDetails.map((list, i) => (
        <div key={i} className="flex justify-between">
          <h4 className="text-[#1F2024] font-semibold text-sm">{list.header}</h4>
          <p className="text-[#71727A] text-sm">{list.details}</p>
        </div>
      ))}
    </div>
  );
};

export default BankDetailsList;
