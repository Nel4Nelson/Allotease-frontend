'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarNavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const navigationItems: SidebarNavItem[] = [
  {
    href: '/manage',
    label: 'Overview',
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
        <path d="M213.66,101.66,128,187.31,42.34,101.66a8,8,0,0,1,11.32-11.32L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/>
      </svg>
    ),
  },
  {
    href: '/manage/reservations',
    label: 'Reservations',
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
        <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Z"/>
      </svg>
    ),
    badge: 3,
  },
  {
    href: '/manage/withdrawal',
    label: 'Withdrawal',
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
        <path d="M224,128a104,104,0,1,1-104-104A104.11,104.11,0,0,1,224,128Z"/>
      </svg>
    ),
  },
];

export function ManagementSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <h2 className="text-lg font-bold text-[#1F2024] mb-6">Management</h2>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#FF5B00] text-white'
                    : 'text-[#71727A] hover:bg-gray-100 hover:text-[#1F2024]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                
                {item.badge && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isActive ? 'bg-white text-[#FF5B00]' : 'bg-[#FF5B00] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}