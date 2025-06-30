"use client";
import React from "react";
import { WithdrawalPageHeaderProps } from "@/types/withdrawal";

export function WithdrawalPageHeader({
  title,
  breadcrumb,
  lastUpdated,
}: WithdrawalPageHeaderProps) {
  return (
    <div className="mb-6">
      <nav className="text-sm text-[#71727A] mb-2">
        {breadcrumb.join(" / ")}
      </nav>

      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl text-[#1F2024]">{title}</h1>

        <p className="text-sm text-[#71727A] hidden md:block">
          Last Updated{" "}
          {new Date(lastUpdated).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
