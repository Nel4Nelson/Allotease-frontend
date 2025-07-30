"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ticket } from "phosphor-react";
import SearchHeader from "../../shared/search-header";

const reservations = [
  {
    id: "RES-1001",
    attendee: "Kingsley Promis",
    ticketCount: 2,
    date: "2024-01-19 10:00AM",
  },
  {
    id: "RES-1002",
    attendee: "Ada Eze",
    ticketCount: 1,
    date: "2024-02-01 02:30PM",
  },
  {
    id: "RES-1003",
    attendee: "Chika Obi",
    ticketCount: 4,
    date: "2024-03-15 09:00AM",
  },
  {
    id: "RES-1004",
    attendee: "Michael Umeh",
    ticketCount: 3,
    date: "2024-04-10 01:15PM",
  },
  {
    id: "RES-1005",
    attendee: "Ngozi Okafor",
    ticketCount: 5,
    date: "2024-05-20 11:45AM",
  },
];

export default function EventReservationTable() {
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

  return (
    <div className="overflow-x-auto rounded-md bg-[#F2F4F7]/50 border">
      <h2 className="p-3">
        <h2>Recent reservations</h2>
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

      <Table className="min-w-full w-full">
        <TableHeader className="bg-[#F2F4F7CC]">
          <TableRow>
            <TableHead className="w-[140px] border-[#8AAEA433] text-[#20232A] font-medium">
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
          {reservations.map((r) => (
            <TableRow key={r.id} className="text-[#71727A] border-none">
              <TableCell className="font-medium">{r.id}</TableCell>
              <TableCell>{r.attendee}</TableCell>

              <TableCell className="hidden md:table-cell">
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: r.ticketCount }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1 border border-[#0A9355] rounded-md px-2 py-1 text-[#0A9355]"
                    >
                      <Ticket size={20} />
                      <span className="text-sm font-medium">#{i + 1}</span>
                    </div>
                  ))}
                </div>
              </TableCell>

              <TableCell className="hidden md:table-cell">{r.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
