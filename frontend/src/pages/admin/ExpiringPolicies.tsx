
import AdminLayout from "@/components/layout/AdminLayout"
import { AlertTriangle } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data - replace with API data later
const expiringPolicies = [
  {
    id: "POL-005",
    client: "Michael Brown",
    email: "michael@university.edu",
    type: "Personal Accident",
    expiryDate: "2024-04-20",
    daysLeft: 5,
  },
  {
    id: "POL-006",
    client: "Sarah Wilson",
    email: "sarah@university.edu",
    type: "Medical Cover",
    expiryDate: "2024-04-21",
    daysLeft: 6,
  },
]

const ExpiringPolicies = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <Card className="mb-8 border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Expiring Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-800">
              The following policies are expiring within the next 7 days.
              Consider sending reminder emails to the policy holders.
            </p>
          </CardContent>
        </Card>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expiringPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.id}</TableCell>
                  <TableCell>{policy.client}</TableCell>
                  <TableCell>{policy.email}</TableCell>
                  <TableCell>{policy.type}</TableCell>
                  <TableCell>{policy.expiryDate}</TableCell>
                  <TableCell>{policy.daysLeft} days</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Send Reminder
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ExpiringPolicies
