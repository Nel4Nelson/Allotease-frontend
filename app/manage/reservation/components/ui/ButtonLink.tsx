"use client";

import Link from "next/link";
import React from "react";

type ButtonLinkProps = {
  text: string;
  href: string;
  className?: string;
};

const ButtonLink: React.FC<ButtonLinkProps> = ({
  text,
  href,
  className = "",
}) => {
  return (
    <Link href={href}>
      <div
        className={`inline-block px-4 py-2 rounded-full font-source font-bold text-[#FF5B00] border border-[#FF5B00] text-sm md:text-lg hover:bg-opacity-90 transition ${className}`}
      >
        {text}
      </div>
    </Link>
  );
};

export default ButtonLink;
