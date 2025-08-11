import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SearchHeader from "../../../../components/features/management/shared/search-header";

type Reservation = {
  id: string;
  guest: string;
  room: string;
  dates: string;
  status: "Pending" | "Confirmed" | "Cancelled";
};

const reservations: Reservation[] = [
  {
    id: "RES-1001",
    guest: "Kingsley Promise",
    room: "Classic King Room",
    dates: "May 31 - Jun 1",
    status: "Pending",
  },
  {
    id: "RES-1002",
    guest: "Amaka Onyeka",
    room: "Deluxe Twin Room",
    dates: "June 5 - June 6",
    status: "Confirmed",
  },
  {
    id: "RES-1003",
    guest: "Michael Obasi",
    room: "Standard Suite",
    dates: "June 10 - June 12",
    status: "Cancelled",
  },
  {
    id: "RES-1004",
    guest: "Sandra Umeh",
    room: "Executive Suite",
    dates: "June 18 - June 19",
    status: "Pending",
  },
  {
    id: "RES-1005",
    guest: "Chukwuemeka Udo",
    room: "Classic King Room",
    dates: "July 1 - July 3",
    status: "Confirmed",
  },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Pending":
      return {
        bg: "bg-[#FEEDD6]",
        text: "text-[#F07C29]",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#F07C29"
            viewBox="0 0 256 256"
          >
            <path d="M128,24A104,104,0,1,0,232,128,104.12,104.12,0,0,0,128,24Zm0,184a80,80,0,1,1,80-80A80.09,80.09,0,0,1,128,208Zm8-80V88a8,8,0,0,0-16,0v48a8,8,0,0,0,3.6,6.7l32,20a8,8,0,1,0,8.8-13.4Z" />
          </svg>
        ),
      };
    case "Confirmed":
      return {
        bg: "bg-[#ECFDF3]",
        text: "text-[#0A9355]",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#0A9355"
            viewBox="0 0 256 256"
          >
            <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
          </svg>
        ),
      };
    case "Cancelled":
      return {
        bg: "bg-[#FFE2E7]",
        text: "text-[#EB4244]",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="#EB4244"
            viewBox="0 0 256 256"
          >
            <path d="M96.26,37.05A8,8,0,0,1,102,27.29a104.11,104.11,0,0,1,52,0,8,8,0,0,1-2,15.75,8.15,8.15,0,0,1-2-.26,88.09,88.09,0,0,0-44,0A8,8,0,0,1,96.26,37.05ZM53.79,55.14a104.05,104.05,0,0,0-26,45,8,8,0,0,0,15.42,4.27,88,88,0,0,1,22-38.09A8,8,0,0,0,53.79,55.14ZM43.21,151.55a8,8,0,1,0-15.42,4.28,104.12,104.12,0,0,0,26,45,8,8,0,0,0,11.41-11.22A88.14,88.14,0,0,1,43.21,151.55ZM150,213.22a88,88,0,0,1-44,0,8,8,0,1,0-4,15.49,104.11,104.11,0,0,0,52,0,8,8,0,0,0-4-15.49ZM222.65,146a8,8,0,0,0-9.85,5.58,87.91,87.91,0,0,1-22,38.08,8,8,0,1,0,11.42,11.21,104,104,0,0,0,26-45A8,8,0,0,0,222.65,146Zm-9.86-41.54a8,8,0,0,0,15.42-4.28,104,104,0,0,0-26-45,8,8,0,1,0-11.41,11.22A88,88,0,0,1,212.79,104.45Z" />
          </svg>
        ),
      };
    default:
      return { bg: "", text: "", icon: null };
  }
};

export function StayReservationTable() {
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
      <h2 className="text-[var(--color-dark-slate)] font-source-sans-pro text-[20px] font-semibold leading-normal mb-2">
        Recent reservations
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
            <TableHead className="text-[#20232A] font-medium">Guest</TableHead>
            <TableHead className="text-[#20232A] font-medium hidden sm:table-cell">
              Room
            </TableHead>
            <TableHead className="text-[#20232A] font-medium hidden sm:table-cell">
              Dates
            </TableHead>
            <TableHead className="text-[#20232A] font-medium hidden sm:table-cell">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reservations.map((res, i) => {
            const { bg, text, icon } = getStatusStyle(res.status);
            return (
              <TableRow key={i} className="text-[#71727A] border-none">
                <TableCell className="font-medium">{res.id}</TableCell>
                <TableCell>{res.guest}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {res.room}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {res.dates}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${bg} ${text}`}
                  >
                    {icon} {res.status}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
