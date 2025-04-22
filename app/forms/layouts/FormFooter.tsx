import Image from "next/image";
import Link from "next/link";
import React from "react";

const FormFooter = () => {
  return (
    <div className="flex justify-center items-center gap-2">
      <p className="text-[#7A7A7A] text-xs pb-1">Powered by</p>
      <Link href="/" className="flex items-center">
        <Image
          src="/images/logo.svg"
          alt="Allotease Logo"
          height={32}
          width={50}
        />
      </Link>
    </div>
  );
};

export default FormFooter;
