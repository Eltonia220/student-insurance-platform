
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PolicySearchProps {
  onSearch: (value: string) => void
}

const PolicySearch = ({ onSearch }: PolicySearchProps) => {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search policies..."
          className="pl-9"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Button>Filter</Button>
    </div>
  )
}

export default PolicySearch
