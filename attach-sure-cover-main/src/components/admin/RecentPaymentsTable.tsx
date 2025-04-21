
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data - replace with API data later
const payments = [
  {
    id: "1",
    studentName: "John Doe",
    amount: "15,000",
    status: "successful",
    transactionId: "MPESA7890123",
    timestamp: "2024-04-14T10:30:00",
  },
  {
    id: "2",
    studentName: "Jane Smith",
    amount: "12,500",
    status: "pending",
    transactionId: "MPESA7890124",
    timestamp: "2024-04-14T09:45:00",
  },
  // Add more mock data as needed
];

const RecentPaymentsTable = () => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Amount (KES)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.studentName}</TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>
                <Badge
                  variant={payment.status === "successful" ? "default" : "secondary"}
                >
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell className="font-mono">{payment.transactionId}</TableCell>
              <TableCell>
                {new Date(payment.timestamp).toLocaleTimeString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentPaymentsTable;
