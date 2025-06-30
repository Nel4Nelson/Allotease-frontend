'use client';
import React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ManagementLayout } from '@/components/features/management/management-layout';

export default function ManagePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <ManagementLayout />
      </main>
      <Footer />
    </div>
  );
}