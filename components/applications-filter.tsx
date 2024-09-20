import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Application,
  APPLICATION_STATUSES,
  APPLICATION_TYPES,
} from "@/lib/types";
import { useEffect, useState } from "react";

interface ApplicationsFilterProps {
  applications: Application[];
  setApplications: (apps: Application[]) => void;
}

const ApplicationsFilter: React.FC<ApplicationsFilterProps> = ({
  applications,
  setApplications,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  useEffect(() => {
    const filtered = applications.filter((app) => {
      const matchesSearch = Object.values(app).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesStatus =
        statusFilter !== "ALL" ? app.status === statusFilter : true;
      const matchesType = typeFilter !== "ALL" ? app.type === typeFilter : true;
      return matchesSearch && matchesStatus && matchesType;
    });
    setApplications(filtered);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications, searchTerm, statusFilter, typeFilter]);

  return (
    <div className="mb-4 flex space-x-4">
      <Input
        placeholder="Search applications..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {APPLICATION_STATUSES.concat("ALL").map((status) => (
            <SelectItem key={status} value={status}>
              {status.replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          {APPLICATION_TYPES.concat("ALL").map((type) => (
            <SelectItem key={type} value={type}>
              {type.replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ApplicationsFilter;
