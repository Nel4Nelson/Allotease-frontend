"use client";
import React from "react";
import { ManagementStatsProps } from "@/types";

function StatCard({
  title,
  value,
  growth,
  icon,
  currency,
}: {
  title: string;
  value: number | string;
  growth: number;
  icon: React.ReactNode;
  currency?: string;
}) {
  const formatValue = (val: number | string) => {
    if (typeof val === "number" && currency) {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: currency === "NGN" ? "NGN" : "USD",
        notation: "compact",
        maximumFractionDigits: 0,
      }).format(val);
    }
    return val.toString();
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="text-[#FF5B00]">{icon}</div>
        <div className={`text-xs font-medium ${getGrowthColor(growth)}`}>
          {growth > 0 ? "+" : ""}
          {growth}%
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-[#1F2024] mb-1">
          {formatValue(value)}
        </h3>
        <p className="text-sm text-[#71727A]">{title}</p>
      </div>
    </div>
  );
}

export function ManagementStats({ stats, isLoading }: ManagementStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 p-4 rounded-lg animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-2" />
            <div className="h-8 bg-gray-300 rounded mb-1" />
            <div className="h-4 bg-gray-300 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total reservations"
        value={stats.totalReservations.count}
        growth={stats.totalReservations.growth}
        icon={
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" />
          </svg>
        }
      />

      <StatCard
        title="Check-ins today"
        value={stats.checkInsToday.count}
        growth={stats.checkInsToday.growth}
        icon={
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
          </svg>
        }
      />

      <StatCard
        title="Available spaces"
        value={stats.availableSpaces.count}
        growth={stats.availableSpaces.growth}
        icon={
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M240,208H224V136l2.34,2.34A8,8,0,0,0,237.66,127L139.31,28.68a16,16,0,0,0-22.62,0L18.34,127a8,8,0,0,0,11.32,11.31L32,136v72H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM48,120l80-80,80,80v88H48Z" />
          </svg>
        }
      />

      <StatCard
        title="Revenue this month"
        value={stats.revenueThisMonth.amount}
        growth={stats.revenueThisMonth.growth}
        currency={stats.revenueThisMonth.currency}
        icon={
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM170.83,133.58a8,8,0,0,1-11.24,1.24A52,52,0,0,1,144,88.62V88a8,8,0,0,1,16,0v.62a36,36,0,0,1,11.64,31.78A8,8,0,0,1,160,128a36,36,0,0,1-32,35.78V168a8,8,0,0,1-16,0v-4.22A52,52,0,0,1,96.38,119.2a8,8,0,1,1,15.24-4.4A36,36,0,0,1,128,152a36,36,0,0,1,0-72,36,36,0,0,1,16.38,3.8,8,8,0,0,1,1.24,11.24A8,8,0,0,1,170.83,133.58Z" />
          </svg>
        }
      />
    </div>
  );
}
