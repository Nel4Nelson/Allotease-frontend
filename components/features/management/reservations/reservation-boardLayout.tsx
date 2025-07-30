"use client";

import Image from "next/image";
import ButtonLink from "../../../../app/manage/reservation/components/ui/ButtonLink";

type DashboardLayoutProps = {
  children: React.ReactNode;
  imageSrc: string;
  headerTitle: string;
  buttonText: string;
  buttonHref: string;
};

export default function ReservationboardLayout({
  children,
  imageSrc,
  headerTitle,
  buttonText,
  buttonHref,
}: DashboardLayoutProps) {
  return (
    <div className="w-full">
      <div className="relative w-full h-[400px]">
        <Image
          src={imageSrc}
          alt={headerTitle}
          fill
          className="object-cover rounded-2xl"
        />
      </div>

      <div className="flex items-center justify-between py-8">
        <h2>{headerTitle}</h2>
        <ButtonLink text={buttonText} href={buttonHref} />
      </div>

      <main className="flex-1 p-4 overflow-y-auto">{children}</main>
    </div>
  );
}
