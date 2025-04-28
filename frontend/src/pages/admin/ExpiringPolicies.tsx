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
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

// Mock data - replace with API data later
const expiringPolicies = [
  {
    id: "POL-005",
    client: "Michael Brown",
    email: "eltonianyingi@gmail.com",
    type: "Personal Accident",
    expiryDate: "2025-04-31",
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
  const [sendingReminders, setSendingReminders] = useState({});

  const handleSendReminder = async (policy) => {
    try {
      // Set loading state for this specific policy
      setSendingReminders(prev => ({ ...prev, [policy.id]: true }));

       // Point to your actual backend URL - adjust as needed
    const response = await fetch('http://localhost:3001/api/send-policy-reminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        policyId: policy.id,
        clientEmail: policy.email,
        clientName: policy.client,
        policyType: policy.type,
        expiryDate: policy.expiryDate
      }),
    });
      
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success - using "default" variant instead of "success"
      toast({
        title: "Reminder Sent",
        description: `Reminder email sent to ${policy.client} at ${policy.email}`,
        variant: "default",
      });
    } catch (error) {
      // Handle error
      toast({
        title: "Failed to Send",
        description: "There was an error sending the reminder. Please try again.",
        variant: "destructive",
      });
      console.error("Error sending reminder:", error);
    } finally {
      // Reset loading state
      setSendingReminders(prev => ({ ...prev, [policy.id]: false }));
    }
  };

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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSendReminder(policy)}
                      disabled={sendingReminders[policy.id]}
                    >
                      {sendingReminders[policy.id] ? "Sending..." : "Send Reminder"}
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