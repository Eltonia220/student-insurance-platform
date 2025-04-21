
import { useState } from "react"
import AdminLayout from "@/components/layout/AdminLayout"
import PolicySearch from "@/components/admin/PolicySearch"
import PoliciesTable from "@/components/admin/PoliciesTable"

// Mock data - replace with API data later
const policies = [
  {
    id: "POL-001",
    client: "John Doe",
    email: "john@university.edu",
    type: "Personal Accident",
    startDate: "2024-01-15",
    endDate: "2025-01-14",
    status: "Active",
  },
  {
    id: "POL-002",
    client: "Jane Smith",
    email: "jane@university.edu",
    type: "Medical Cover",
    startDate: "2024-02-01",
    endDate: "2025-01-31",
    status: "Active",
  },
]

const Policies = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    // TODO: Implement search functionality
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Insurance Policies</h1>
          <PolicySearch onSearch={handleSearch} />
        </div>
        <PoliciesTable policies={policies} />
      </div>
    </AdminLayout>
  )
}

export default Policies
