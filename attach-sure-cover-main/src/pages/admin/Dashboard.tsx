
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, AlertTriangle, DollarSign } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import RecentPaymentsTable from "@/components/admin/RecentPaymentsTable";

const DashboardCard = ({ title, value, description, icon: Icon }: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <CardDescription className="text-xs">{description}</CardDescription>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Active Policies"
            value="2,850"
            description="Active insurance policies"
            icon={Users}
          />
          <DashboardCard
            title="Expiring Soon"
            value="42"
            description="Policies expiring in 7 days"
            icon={AlertTriangle}
          />
          <DashboardCard
            title="Weekly Payments"
            value="KES 245,000"
            description="+20.1% from last week"
            icon={DollarSign}
          />
          <DashboardCard
            title="Daily Activity"
            value="24"
            description="New applications today"
            icon={Activity}
          />
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Recent Payments</h3>
          <RecentPaymentsTable />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
