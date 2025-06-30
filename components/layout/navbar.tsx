// /components/layout/navbar.tsx - Updated version
"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearch } from "@/hooks/use-search";

export function Navbar() {
  const { isSearchVisible, toggleSearch, hideSearch } = useSearch();

  const SearchIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#71727a"
      viewBox="0 0 256 256"
      className="mr-1"
    >
      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
    </svg>
  );

  const NavItem = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href?: string;
  }) => {
    const content = (
      <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
        {children}
      </div>
    );

    if (href) {
      return <Link href={href}>{content}</Link>;
    }

    return content;
  };

  return (
    <nav className="flex items-center gap-1 justify-between px-4 md:px-8 py-2 sm:py-4 border font-source bg-white">
      <div className="flex items-center gap-2 md:gap-10">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="Allotease Logo"
            width={120}
            height={40}
            priority
          />
        </Link>

        {/* Search Section */}
        <div className="relative">
          {/* Desktop Search - Always visible */}
          <div className="hidden sm:flex items-center border border-[#8AAEA433] h-[40px] max-w-[300px] w-full rounded-full px-2 py-1 bg-[#F2F4F780]">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by address"
              className="outline-none text-[#71727A] bg-transparent flex-1"
            />
          </div>

          {/* Mobile Search - Toggleable */}
          <div className="sm:hidden">
            {isSearchVisible ? (
              <div className="flex items-center border border-[#8AAEA433] rounded-full px-2 py-1 bg-[#F2F4F780]">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search by address"
                  className="outline-none text-sm w-[120px] text-[#71727A] bg-transparent"
                  autoFocus
                  onBlur={hideSearch}
                />
              </div>
            ) : (
              <button onClick={toggleSearch} className="p-1">
                <SearchIcon />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Side Navigation - Hide when mobile search is active */}
      {!isSearchVisible && (
        <div className="flex items-center gap-3 md:gap-6 lg:gap-10">
          <NavItem href="/create/event">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#1f3a3a"
              viewBox="0 0 256 256"
            >
              <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
            </svg>
            <h4 className="font-semibold text-[#1F3A3A] text-sm lg:text-base hidden md:block">
              Create an event
            </h4>
          </NavItem>

          <NavItem href="/tickets">
            <div className="w-[8px] h-[8px] bg-[#FF5B00] rounded-full"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#1f3a3a"
              viewBox="0 0 256 256"
            >
              <path d="M232,104a8,8,0,0,0,8-8V64a16,16,0,0,0-16-16H32A16,16,0,0,0,16,64V96a8,8,0,0,0,8,8,24,24,0,0,1,0,48,8,8,0,0,0-8,8v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160a8,8,0,0,0-8-8,24,24,0,0,1,0-48ZM32,167.2a40,40,0,0,0,0-78.4V64H88V192H32Zm192,0V192H104V64H224V88.8a40,40,0,0,0,0,78.4Z"></path>
            </svg>
            <h4 className="font-semibold text-[#1F3A3A] text-sm lg:text-base hidden md:block">
              Ticket
            </h4>
          </NavItem>

          <div className="flex items-center gap-1">
            <Avatar className="bg-[#406832] flex justify-center items-center">
              <AvatarImage src="/icons/star.svg" className="w-[1rem]" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex w-[10.5rem] items-center gap-1 truncate lg:flex">
              <p className="text-[#1F2024]">obiruby@gmail.com</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#1f3a3a"
                viewBox="0 0 256 256"
              >
                <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
              </svg>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
