'use client';

import React from 'react';
import { Browsers, Wine, Armchair } from 'phosphor-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  title: string;
  Icon: React.ElementType;
  href: string;
}

const SidebBar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const pathname = usePathname();

  const items: SidebarItem[] = [
    { title: 'Overview', Icon: Browsers, href: '/manage/overview' },
    { title: 'Reservation', Icon: Wine, href: '/manage/reservation' },
    { title: 'Withdrawal', Icon: Armchair, href: '/manage/withdrawal' },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6 font-space-grotesk">
        Management
      </h3>
      {items.map((item, index) => {
        const isActive = pathname === item.href || activeTab === item.title;
        return (
          <Link
            key={index}
            href={item.href}
            onClick={() => setActiveTab(item.title)}
            className={`flex items-center space-x-2 px-4 py-3 cursor-pointer rounded-md transition-all duration-100 ${
              isActive ? 'bg-[#E6F7F0]' : 'hover:bg-[#F2F4F7CC]'
            }`}
          >
            <item.Icon size={24} color="#71727A" />
            <h5 className="text-sm font-medium text-gray-700">{item.title}</h5>
          </Link>
        );
      })}
    </div>
  );
};

export default SidebBar;
