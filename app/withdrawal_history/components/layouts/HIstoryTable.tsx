import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const histories = [
  {
    AmountRequested: "N300,000",
    WithdrawalFees: "3,000",
    DateRequested: "October 10, 2024",
    PayoutDate: "",
    Status: "Declined",
  },
  {
    AmountRequested: "N300,000",
    WithdrawalFees: "3,000",
    DateRequested: "October 10, 2024",
    PayoutDate: "October 10, 2024",
    Status: "Paid",
  },
];

export function HistoryTable() {
  return (
    <div className="px-4 md:px-8 py-4 md:py-6">
      <Table>
        <TableHeader className="bg-[#F2F4F780]">
          <TableRow>
            <TableHead className="w-[100px] border-[#8AAEA433] text-[#20232A] font-medium">
              AmountRequested
            </TableHead>
            <TableHead>WithdrawalFees</TableHead>
            <TableHead>DateRequested</TableHead>
            <TableHead>PayoutDate</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {histories.map((history, i) => {
            const isDeclined = history.Status === "Declined";
            return (
              <TableRow key={i} className="text-[#71727A] border-none">
                <TableCell className="font-medium">
                  {history.AmountRequested}
                </TableCell>
                <TableCell>{history.WithdrawalFees}</TableCell>
                <TableCell>{history.DateRequested}</TableCell>
                <TableCell>{history.PayoutDate || "_"}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      isDeclined
                        ? "bg-[#FFE2E7] text-[#EB4244]"
                        : "bg-[#ECFDF3] text-[#0A9355]"
                    }`}
                  >
                    {isDeclined ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="#EB4244"
                          viewBox="0 0 256 256"
                        >
                          <path d="M96.26,37.05A8,8,0,0,1,102,27.29a104.11,104.11,0,0,1,52,0,8,8,0,0,1-2,15.75,8.15,8.15,0,0,1-2-.26,88.09,88.09,0,0,0-44,0A8,8,0,0,1,96.26,37.05ZM53.79,55.14a104.05,104.05,0,0,0-26,45,8,8,0,0,0,15.42,4.27,88,88,0,0,1,22-38.09A8,8,0,0,0,53.79,55.14ZM43.21,151.55a8,8,0,1,0-15.42,4.28,104.12,104.12,0,0,0,26,45,8,8,0,0,0,11.41-11.22A88.14,88.14,0,0,1,43.21,151.55ZM150,213.22a88,88,0,0,1-44,0,8,8,0,1,0-4,15.49,104.11,104.11,0,0,0,52,0,8,8,0,0,0-4-15.49ZM222.65,146a8,8,0,0,0-9.85,5.58,87.91,87.91,0,0,1-22,38.08,8,8,0,1,0,11.42,11.21,104,104,0,0,0,26-45A8,8,0,0,0,222.65,146Zm-9.86-41.54a8,8,0,0,0,15.42-4.28,104,104,0,0,0-26-45,8,8,0,1,0-11.41,11.22A88,88,0,0,1,212.79,104.45Z"></path>
                        </svg>{" "}
                        Declined
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="#0A9355"
                          viewBox="0 0 256 256"
                        >
                          <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
                        </svg>{" "}
                        Paid
                      </>
                    )}
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
