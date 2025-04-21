
import AdminLayout from "@/components/layout/AdminLayout"
import { DollarSign } from "lucide-react"
import RecentPaymentsTable from "@/components/admin/RecentPaymentsTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const Payments = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Overview
            </CardTitle>
            <CardDescription>
              View and manage all payment transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Payments Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KES 127,500</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl font-bold mb-4">Recent Payments</h2>
        <RecentPaymentsTable />
      </div>
    </AdminLayout>
  )
}

export default Payments
