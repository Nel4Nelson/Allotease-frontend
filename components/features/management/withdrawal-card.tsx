"use client";
import React from "react";
import Image from "next/image";
import { WithdrawalCardProps } from "@/types/management";

export function WithdrawalCard({
  hostProfile,
  onWithdraw,
  isLoading,
}: WithdrawalCardProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg px-4 py-3 w-full max-w-[400px]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-[50px] h-[50px] rounded-full bg-[#FF5B00] border-2 border-[#BC4300] flex items-center justify-center">
            <Image
              src={hostProfile.avatar || "/icons/star.svg"}
              alt={`${hostProfile.businessName} avatar`}
              width={30}
              height={30}
              className="object-contain"
            />
          </div>

          <div>
            <h5 className="font-bold text-sm md:text-base text-[#1F2024] flex items-center gap-1">
              {hostProfile.businessName}
              {hostProfile.isVerified && (
                <svg
                  width="16"
                  height="16"
                  fill="#3B82F6"
                  viewBox="0 0 256 256"
                >
                  <path d="M225.86,102.82c-3.77-3.94-5.7-9.62-5.7-16.82s1.93-12.88,5.7-16.82L236.32,57.73a8,8,0,0,0-.3-11.31L224.58,35.17a8,8,0,0,0-11.31-.3L201.82,46.14c-3.94,3.77-9.62,5.7-16.82,5.7s-12.88-1.93-16.82-5.7L156.73,34.68a8,8,0,0,0-11.31.3L134.17,46.42a8,8,0,0,0-.3,11.31l11.27,11.45c3.77,3.94,5.7,9.62,5.7,16.82s-1.93,12.88-5.7,16.82L133.87,114.27a8,8,0,0,0,.3,11.31l11.25,11.25a8,8,0,0,0,11.31.3l11.45-11.27c3.94-3.77,9.62-5.7,16.82-5.7s12.88,1.93,16.82,5.7l11.45,11.27a8,8,0,0,0,11.31-.3l11.25-11.25a8,8,0,0,0,.3-11.31ZM196,140a36,36,0,1,1,36-36A36,36,0,0,1,196,140Z" />
                </svg>
              )}
            </h5>
            <p className="text-[#71727A] text-xs">
              Host since {new Date(hostProfile.joinDate).getFullYear()}
            </p>
          </div>
        </div>

        <button
          onClick={onWithdraw}
          disabled={isLoading}
          className="font-semibold text-white text-xs md:text-sm bg-[#FF5B00] hover:bg-[#E04E00] px-4 py-2 rounded-full border border-[#FF5B00] transition-colors disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Withdraw"}
        </button>
      </div>
    </div>
  );
}
