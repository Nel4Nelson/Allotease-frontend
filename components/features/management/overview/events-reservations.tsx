"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ticket } from "lucide-react";
import SearchHeader from "../shared/search-header";

interface EventReservation {
  id: string;
  attendee: string;
  ticketCount: number;
  date: string;
}

interface EventsReservationsProps {
  reservations: EventReservation[];
  loading?: boolean;
  onSearch?: (value: string) => void;
  onSort?: (value: string) => void;
  onExport?: () => void;
}

export function EventsReservations({
  reservations,
  loading = false,
  onSearch,
  onSort,
  onExport,
}: EventsReservationsProps) {
  const handleSortChange = (value: string) => {
    if (onSort) {
      onSort(value);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  const handleSearch = () => {
    if (onSearch) {
    }
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Reservations
        </h2>

        <div className="p-4">
          <SearchHeader
            onSearch={handleSearch}
            sortOptions={["Time", "Date", "Price"]}
            onSortChange={handleSortChange}
            onExport={handleExport}
            showSort={true}
            showExport={true}
          />
        </div>
      </div>

      <Table className="min-w-full w-full">
        <TableHeader className="bg-[#F2F4F7CC]">
          <TableRow>
            <TableHead className="w-[140px] text-[#20232A] font-medium">
              Reservation ID
            </TableHead>
            <TableHead className="text-[#20232A] font-medium">
              Attendee
            </TableHead>
            <TableHead className="text-[#20232A] font-medium hidden md:table-cell">
              Tickets
            </TableHead>
            <TableHead className="text-[#20232A] font-medium hidden md:table-cell">
              Date
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
              <TableCell>{reservation.attendee}</TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: reservation.ticketCount }).map(
                    (_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 border border-[#0A9355] rounded-md px-2 py-1 text-[#0A9355]"
                      >
                        <Ticket size={16} />
                        <span className="text-sm font-medium">#{i + 1}</span>
                      </div>
                    )
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {reservation.date}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {reservations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No event reservations found
        </div>
      )}
    </div>
  );
}
