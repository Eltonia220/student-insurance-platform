
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Policy {
  id: string
  client: string
  email: string
  type: string
  startDate: string
  endDate: string
  status: string
}

interface PoliciesTableProps {
  policies: Policy[]
}

const PoliciesTable = ({ policies }: PoliciesTableProps) => {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Policy ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => (
            <TableRow key={policy.id}>
              <TableCell className="font-medium">{policy.id}</TableCell>
              <TableCell>{policy.client}</TableCell>
              <TableCell>{policy.email}</TableCell>
              <TableCell>{policy.type}</TableCell>
              <TableCell>{policy.startDate}</TableCell>
              <TableCell>{policy.endDate}</TableCell>
              <TableCell>{policy.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default PoliciesTable
