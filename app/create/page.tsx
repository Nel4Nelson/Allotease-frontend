"use client";
import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CreateHeader, CreateTabs } from "@/components/features/create";

export default function CreatePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white max-w-[965px] mx-auto px-4 sm:px-6 lg:px-[200px] py-8">
        <CreateHeader />
        <CreateTabs />
      </div>
      <Footer />
    </>
  );
}
