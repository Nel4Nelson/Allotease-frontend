"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReservationStatusBadge } from "../shared/reservation-status-badge";
import { TransformedReservation } from "@/utils/stay-reservation-transformer";
import SearchHeader from "../shared/search-header";

// interface StayReservation {
//   id: string;
//   guest: string;
//   room: string;
//   dates: string;
//   status: "Pending" | "Confirmed" | "Cancelled";
// }

interface StaysReservationsProps {
  reservations: TransformedReservation[];
  loading?: boolean;
  onSearch?: (value: string) => void;
  onSort?: (value: string) => void;
  onExport?: () => void;
}

export function StaysReservations({
  reservations,
  loading = false,
}: StaysReservationsProps) {
  const handleSearch = (value: string) => {
    console.log("Searching:", value);
    // Filter table or API call
  };

  const handleSortChange = (option: string) => {
    console.log("Sort changed to:", option);
    // Sort your data
  };

  const handleExport = () => {
    console.log("Exporting table...");
    // Export logic
  };

  if (loading) {
    return (
      <div className="overflow-x-auto rounded-md bg-[#F2F4F7]/50 border">
        <div className="p-4">
          <div className="h-6 bg-gray-200 rounded mb-4 w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-100 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md bg-[#F2F4F7]/50 border">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-[#1F2024] mb-6 font-space-grotesk">
          {" "}
          All reservations
        </h2>

        <SearchHeader
          onSearch={handleSearch}
          sortOptions={["Time", "Date", "Price"]}
          onSortChange={handleSortChange}
          onExport={handleExport}
          showSort={true}
          showExport={true}
        />
      </div>

      <Table className="min-w-full w-full text-md">
        <TableHeader className="bg-[#F2F4F7CC] font-space-grotesk">
          <TableRow>
            <TableHead className="w-[140px] text-[#20232A] font-medium ">
              Reservation ID
            </TableHead>
            <TableHead className="text-[#20232A] font-medium">Guest</TableHead>
            <TableHead className="text-[#20232A] font-medium  sm:table-cell">
              Room
            </TableHead>
            <TableHead className="text-[#20232A] font-medium sm:table-cell">
              Dates
            </TableHead>
            <TableHead className="text-[#20232A] font-medium sm:table-cell">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reservations.map((reservation) => (
            <TableRow
              key={reservation.id}
              className="text-[#71727A] border-none"
            >
              <TableCell className="font-medium">{reservation.id}</TableCell>
              <TableCell>{reservation.guestName}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {reservation.roomType}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {reservation.dates}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <ReservationStatusBadge status={reservation.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {reservations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No reservations found
        </div>
      )}
    </div>
  );
}
