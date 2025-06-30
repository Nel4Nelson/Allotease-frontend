'use client';
import React from 'react';
import { BalanceCard, WithdrawalCard, ManagementStats, RecentReservations } from './';
import { HostListingsSection } from './host-listings-section';
import { useHostBalance } from '@/hooks/use-host-balance';
import { useManagementData } from '@/hooks/use-management-data';
import { useHostProfile } from '@/hooks/use-host-profile';

export function ManagementLayout() {
  const { balance, toggleBalanceVisibility, isLoading: balanceLoading } = useHostBalance();
  const { profile } = useHostProfile();
  const { 
    stats, 
    reservations, 
    listings, 
    listingFilter, 
    isLoading: dataLoading,
    filterListings 
  } = useManagementData();

  const handleWithdraw = async () => {
    // In real app, would open withdrawal modal
    console.log('Opening withdrawal modal');
  };

  const handleViewAllReservations = () => {
    // In real app, would navigate to reservations page
    console.log('Navigating to all reservations');
  };

  return (
    <div className="px-4 md:px-8 py-4 md:py-6 max-w-7xl mx-auto space-y-8">
      {/* Balance Section */}
      <div className="relative">
        <BalanceCard
          balance={balance}
          onToggleVisibility={toggleBalanceVisibility}
          onWithdraw={handleWithdraw}
          isLoading={balanceLoading}
        />
        
        {/* Withdrawal Card - Positioned absolutely */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-6 w-[90%] max-w-[400px]">
          <WithdrawalCard
            hostProfile={profile}
            onWithdraw={handleWithdraw}
            isLoading={balanceLoading}
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-16">
        <ManagementStats stats={stats} isLoading={dataLoading} />
      </div>

      {/* Recent Reservations */}
      <RecentReservations
        reservations={reservations}
        isLoading={dataLoading}
        onViewAll={handleViewAllReservations}
      />

      {/* Host Listings */}
      <HostListingsSection
        listings={listings}
        activeFilter={listingFilter}
        onFilterChange={filterListings}
        isLoading={dataLoading}
      />
    </div>
  );
}
