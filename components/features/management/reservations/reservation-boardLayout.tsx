"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

type DashboardLayoutProps = {
  children: React.ReactNode;
  imageSrc: string;
  headerTitle: string;
  buttonText?: string;
  buttonHref?: string;
};

export default function ReservationboardLayout({
  children,
  imageSrc,
  headerTitle,
  buttonText,
}: DashboardLayoutProps) {
  return (
    <div className="w-full">
      <div className="relative w-full h-[320px]">
        <Image
          src={imageSrc}
          alt={headerTitle}
          fill
          className="object-cover rounded-2xl"
        />
      </div>

      <div className="flex items-center justify-between py-8">
        <h2 className="text-2xl font-bold font-space-grotesk">{headerTitle}</h2>
        {/* <ButtonLink text={buttonText} href={buttonHref} /> */}
        <Button
          variant="allotease-primary"
          className="border border-[#FF5B00] rounded-full font-semibold"
        >
          {buttonText}
        </Button>
      </div>

      <main className="flex-1 p-4 overflow-y-auto">{children}</main>
    </div>
  );
}
