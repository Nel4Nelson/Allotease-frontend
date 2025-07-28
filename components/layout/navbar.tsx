/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SearchIcon,
  PencilIcon,
  TicketIcon,
  ChevronDownIcon,
} from "@/components/icons";
import { useAuthStore } from "@/stores/auth-store";
import { AuthService } from "@/services/auth-service";

export default function Header() {
  // Get auth data directly from store
  const { user, isAuthenticated, getUserRole, isLoading } = useAuthStore();

  // Get user role and email from auth store
  const userRole = getUserRole();
  const userEmail = user?.email || "Guest";

  // Check if user is allocation admin (allocator role)
  const isAllocationAdmin = userRole === "allocator";

  // Handle logout
  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Handle create event button click
  const handleCreateEvent = () => {
    if (userRole === "allocator") {
      // Allocators can create events - redirect to create event page
      window.location.href = "/allocation-admin/create";
    } else {
      // Regular users need to upgrade first
      window.location.href = "/upgrade";
    }
  };

  return (
    <header
      className="w-full bg-white/80 backdrop-blur-sm relative"
      style={{ borderBottom: "1px solid rgba(138, 174, 164, 0.20)" }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-60 blur-2xl"
          style={{
            background:
              "linear-gradient(354deg, #FFF 24.04%, rgba(255, 243, 230, 0.35) 59.41%, #D5FFEB 113.97%)",
            filter: "blur(24px)",
            opacity: 0.6,
          }}
        />
      </div>

      <div className="max-w-[965px] mx-auto px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center h-full">
          {/* Left Section: Logo + Search */}
          <div className="flex items-center flex-1 mr-8">
            {/* Logo */}
            <Image
              src="/images/logo.svg"
              alt="Allotease Logo"
              width={120}
              height={40}
              priority
              className="mr-6 mt-1"
            />

            {/* Search Bar */}
            <div className="flex items-center gap-3 h-10 max-w-[300px] px-3 flex-1 rounded-full border border-gray-300/20 bg-gray-100/50">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by address"
                className="flex-1 bg-transparent border-none outline-none text-gray-600 font-source-sans text-base placeholder:text-gray-500"
                style={{ color: "#71727A" }}
              />
            </div>
          </div>

          {/* Right Section: Action Buttons + User Profile */}
          <div className="flex items-center gap-8">
            {/* Create an event */}
            <button
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
              onClick={handleCreateEvent}
            >
              <PencilIcon />
              <span
                className="font-source-sans text-base font-semibold"
                style={{ color: "#1F3A3A" }}
              >
                Create an event
              </span>
            </button>

            {/* Ticket */}
            <button className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <TicketIcon />
              <span
                className="font-source-sans text-base font-semibold"
                style={{ color: "#1F3A3A" }}
              >
                Ticket
              </span>
            </button>

            {/* User Profile Dropdown - Only show if authenticated */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src="/icons/encircle-star-green-avatar.svg"
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span
                      className="font-source-sans text-base"
                      style={{
                        color: "#1F2024",
                        fontFamily: "var(--font-source-sans), sans-serif",
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "normal",
                      }}
                    >
                      {userEmail}
                    </span>
                    <ChevronDownIcon />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="p-0 border-0 shadow-none bg-transparent"
                  align="end"
                  style={{ width: "309px" }}
                >
                  {/* Custom Dropdown Container */}
                  <div
                    className="flex flex-col items-start gap-4"
                    style={{
                      width: "309px",
                      padding: "20px",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "16px",
                      borderRadius: "16px",
                      border: "1px solid rgba(138, 174, 164, 0.20)",
                      background: "rgba(113, 114, 122, 0.5)",
                      boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.04)",
                      backdropFilter: "blur(21px)",
                    }}
                  >
                    {/* User Info Section */}
                    <div className="flex-col gap-2 w-full">
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src="/icons/encircle-star-green-avatar.svg"
                            alt="User Avatar"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <span
                          style={{
                            color: "#1F2024",
                            fontFamily: "var(--font-source-sans), sans-serif",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "normal",
                          }}
                        >
                          {userEmail}
                        </span>
                      </div>
                      {/* Display user role for debugging/info */}
                      {user && (
                        <div className="flex font-source-sans justify-center mt-1">
                          <span
                            style={{
                              color: "#666",
                              fontSize: "12px",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {userRole === "allocator"
                              ? "Allocation Admin"
                              : "User"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Menu Items Container */}
                    <div
                      className="flex flex-col items-start self-stretch"
                      style={{
                        borderRadius: "16px",
                        background: "rgba(242, 244, 247, 0.50)",
                      }}
                    >
                      {/* Ticket - First item with conditional top rounded corners */}
                      <div
                        className="flex items-center gap-[10px] self-stretch cursor-pointer hover:bg-black/5 transition-colors"
                        style={{
                          padding: "16px 20px",
                          borderBottom: isAllocationAdmin
                            ? "1px solid rgba(138, 174, 164, 0.20)"
                            : "1px solid rgba(138, 174, 164, 0.20)",
                          borderRadius: "16px 16px 0 0", // Top-left and top-right rounded
                        }}
                      >
                        <Image
                          src="/icons/ticket.svg"
                          alt="Ticket"
                          width={16}
                          height={16}
                        />
                        <span
                          style={{
                            color: "#1F2024",
                            fontFamily: "var(--font-source-sans), sans-serif",
                            fontSize: "16px",
                            fontWeight: 600,
                            lineHeight: "normal",
                          }}
                        >
                          Ticket
                        </span>
                      </div>

                      {/* Manage my resources - Only show if user is allocation-admin */}
                      {isAllocationAdmin && (
                        <div
                          className="flex items-center gap-[10px] self-stretch cursor-pointer hover:bg-black/5 transition-colors"
                          style={{
                            padding: "16px 20px",
                            borderBottom: "1px solid rgba(138, 174, 164, 0.20)",
                          }}
                        >
                          <Image
                            src="/icons/browsers.svg"
                            alt="Manage resources"
                            width={16}
                            height={16}
                          />
                          <span
                            style={{
                              color: "#1F2024",
                              fontFamily: "var(--font-source-sans), sans-serif",
                              fontSize: "16px",
                              fontWeight: 600,
                              lineHeight: "normal",
                            }}
                          >
                            Manage my resources
                          </span>
                        </div>
                      )}

                      {/* Create new event */}
                      <div
                        className="flex items-center gap-[10px] self-stretch cursor-pointer hover:bg-black/5 transition-colors"
                        style={{
                          padding: "16px 20px",
                          borderBottom: "1px solid rgba(138, 174, 164, 0.20)",
                        }}
                        onClick={handleCreateEvent}
                      >
                        <Image
                          src="/icons/bank.svg"
                          alt="Create event"
                          width={16}
                          height={16}
                        />
                        <span
                          style={{
                            color: "#1F2024",
                            fontFamily: "var(--font-source-sans), sans-serif",
                            fontSize: "16px",
                            fontWeight: 600,
                            lineHeight: "normal",
                          }}
                        >
                          Create new event
                        </span>
                      </div>

                      {/* About Allotease - Last item with bottom rounded corners */}
                      <div
                        className="flex items-center gap-[10px] self-stretch cursor-pointer hover:bg-black/5 transition-colors"
                        style={{
                          padding: "16px 20px",
                          borderRadius: "0 0 16px 16px", // Bottom-left and bottom-right rounded
                        }}
                      >
                        <Image
                          src="/icons/allotease-icon.svg"
                          alt="About"
                          width={16}
                          height={16}
                        />
                        <span
                          style={{
                            color: "#1F2024",
                            fontFamily: "var(--font-source-sans), sans-serif",
                            fontSize: "16px",
                            fontWeight: 600,
                            lineHeight: "normal",
                          }}
                        >
                          About Allotease
                        </span>
                      </div>
                    </div>

                    {/* Logout Section */}
                    <div
                      className="flex items-center gap-[10px] self-stretch cursor-pointer hover:bg-black/5 transition-colors"
                      style={{
                        padding: "16px 20px",
                        background: "rgba(242, 244, 247, 0.50)",
                        borderRadius: "16px",
                      }}
                      onClick={handleLogout}
                    >
                      <Image
                        src="/icons/logout.svg"
                        alt="Logout"
                        width={16}
                        height={16}
                      />
                      <span
                        style={{
                          color: "#1F2024",
                          fontFamily: "var(--font-source-sans), sans-serif",
                          fontSize: "16px",
                          fontWeight: 600,
                          lineHeight: "normal",
                        }}
                      >
                        Log Out
                      </span>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Show login/signup buttons if not authenticated and not loading */}
            {!isAuthenticated && !isLoading && (
              <div className="flex items-center gap-4">
                <button
                  className="font-source-sans text-base font-semibold text-[#1F3A3A] hover:opacity-70 transition-opacity"
                  onClick={() => (window.location.href = "/login")}
                >
                  Login
                </button>
                <button
                  className="font-source-sans text-base font-semibold bg-[#1F3A3A] text-white px-4 py-2 rounded-lg hover:opacity-80 transition-opacity"
                  onClick={() => (window.location.href = "/signup")}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Show loading state */}
            {isLoading && (
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-[#1F3A3A] rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
