"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { Button } from "../ui/button";

// Animated Create Text Component
interface AnimatedCreateTextProps {
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedCreateText: React.FC<AnimatedCreateTextProps> = ({
  className,
  style,
}) => {
  const [currentText, setCurrentText] = useState("event");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return; // Don't animate when hovered

    const interval = setInterval(() => {
      setCurrentText((prev) => (prev === "event" ? "stay" : "event"));
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <span
      className={className}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ display: "inline-block", minWidth: "125px" }}>
        Create a{currentText === "event" ? "n" : ""} {currentText}
      </span>
    </span>
  );
};

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
    if (!isAuthenticated) {
      // Unauthenticated users redirect to create event page
      window.location.href = "/allocation-admin/create";
    } else if (userRole === "allocator") {
      // Allocators can create events - redirect to create event page
      window.location.href = "/allocation-admin/create";
    } else {
      // Regular authenticated users need to upgrade first
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
          {/* Left Section: Logo + Search (Desktop only) */}
          <div className="flex items-center flex-1 mr-8">
            {/* Logo */}
            <Link href="/" className="cursor-pointer">
              <Image
                src="/images/logo.svg"
                alt="Allotease Logo"
                width={120}
                height={40}
                priority
                className="mr-6 mt-1"
              />
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-3 h-10 max-w-[300px] px-3 flex-1 rounded-full border border-gray-300/20 bg-gray-100/50">
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
            {/* Desktop Action Buttons - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-8">
              {/* Create an event */}
              <button
                className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
                onClick={handleCreateEvent}
              >
                <PencilIcon />
                <AnimatedCreateText
                  className="font-source-sans text-base font-semibold"
                  style={{ color: "#1F3A3A" }}
                />
              </button>

              {/* Ticket */}
              <Link
                href="/tickets"
                className="flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
              >
                <TicketIcon />
                <span
                  className="font-source-sans text-base font-semibold"
                  style={{ color: "#1F3A3A" }}
                >
                  Ticket
                </span>
              </Link>
            </div>

            {/* Mobile Action Icons - Only show on mobile */}
            <div className="flex md:hidden items-center gap-4">
              {/* Pencil Icon - Mobile */}
              <button
                className="p-2 hover:opacity-70 transition-opacity cursor-pointer"
                onClick={handleCreateEvent}
              >
                <PencilIcon />
              </button>

              {/* Ticket Icon - Mobile */}
              <Link
                href="/tickets"
                className="p-2 hover:opacity-70 transition-opacity cursor-pointer"
              >
                <TicketIcon />
              </Link>
            </div>

            {/* User Profile Dropdown - Show if authenticated */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors cursor-pointer md:border-l md:border-l-gray-300/20 md:pl-4"
                    style={{
                      borderTopLeftRadius: "0px",
                      borderBottomLeftRadius: "0px",
                    }}
                  >
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
                    {/* Email - Hidden on mobile */}
                    <span
                      className="hidden md:block font-source-sans text-base"
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
                    <ChevronDownIcon className="hidden md:block" />
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

                    {/* Mobile Search Bar - Only show on mobile */}
                    <div className="flex md:hidden items-center gap-3 h-10 w-full px-3 rounded-full border border-gray-300/20 bg-gray-100/50">
                      <SearchIcon />
                      <input
                        type="text"
                        placeholder="Search by address"
                        className="flex-1 bg-transparent border-none outline-none text-gray-600 font-source-sans text-base placeholder:text-gray-500"
                        style={{ color: "#71727A" }}
                      />
                    </div>

                    {/* Menu Items Container */}
                    <div
                      className="flex flex-col items-start self-stretch"
                      style={{
                        borderRadius: "16px",
                        background: "rgba(242, 244, 247, 0.50)",
                      }}
                    >
                      {/* Mobile Action Items - Only show on mobile */}
                      <div className="flex md:hidden flex-col w-full">
                        {/* Create new event - Mobile */}
                        <div
                          className="flex items-center gap-[10px] self-stretch cursor-pointer hover:bg-black/5 transition-colors"
                          style={{
                            padding: "16px 20px",
                            borderBottom: "1px solid rgba(138, 174, 164, 0.20)",
                            borderRadius: "16px 16px 0 0",
                          }}
                          onClick={handleCreateEvent}
                        >
                          <PencilIcon />
                          <AnimatedCreateText
                            style={{
                              color: "#1F2024",
                              fontFamily: "var(--font-source-sans), sans-serif",
                              fontSize: "16px",
                              fontWeight: 600,
                              lineHeight: "normal",
                            }}
                          />
                        </div>

                        {/* Ticket - Mobile */}
                        <Link
                          href="/tickets"
                          className="flex items-center gap-[10px] self-stretch cursor-pointer hover:bg-black/5 transition-colors"
                          style={{
                            padding: "16px 20px",
                            borderBottom: "1px solid rgba(138, 174, 164, 0.20)",
                          }}
                        >
                          <TicketIcon />
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
                        </Link>
                      </div>

                      {/* Regular Menu Items */}
                      {/* Ticket - Desktop only */}
                      <Link
                        href="/tickets"
                        className="hidden md:flex items-center gap-[10px] self-stretch cursor-pointer hover:bg-black/5 transition-colors"
                        style={{
                          padding: "16px 20px",
                          borderBottom: isAllocationAdmin
                            ? "1px solid rgba(138, 174, 164, 0.20)"
                            : "1px solid rgba(138, 174, 164, 0.20)",
                          borderRadius: "16px 16px 0 0",
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
                      </Link>

                      {/* Manage my resources - Only show if user is allocation-admin */}
                      {isAllocationAdmin && (
                        <Link
                          href="/allocation-admin"
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
                        </Link>
                      )}

                      {/* Create new event - Desktop only */}
                      <div
                        className="hidden md:flex items-center gap-[10px] self-stretch cursor-pointer hover:bg-black/5 transition-colors"
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
                        <AnimatedCreateText
                          style={{
                            color: "#1F2024",
                            fontFamily: "var(--font-source-sans), sans-serif",
                            fontSize: "16px",
                            fontWeight: 600,
                            lineHeight: "normal",
                          }}
                        />
                      </div>

                      {/* About Allotease - Last item with bottom rounded corners */}
                      <Link
                        href="/about"
                        className="flex items-center gap-[10px] self-stretch cursor-pointer hover:bg-black/5 transition-colors"
                        style={{
                          padding: "16px 20px",
                          borderRadius: "0 0 16px 16px",
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
                      </Link>
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
                <Link href="/signin">
                  <Button
                    variant="signup-primary"
                    size="allotease-sm"
                    aria-label="Sign in to your account"
                    
                  >
                    Sign In
                  </Button>
                </Link>
                {/* <Link href="/signup">
                  <Button
                    variant="allotease-blur"
                    size="allotease-sm"
                    aria-label="Sign in to your account"
                    className="font-bold border"
                  >
                    Sign Up
                  </Button>
                </Link> */}
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