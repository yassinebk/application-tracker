import { useState } from "react";
import { Application, mapStatusToBadge } from "@/lib/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatDate } from "@/lib/utils";
import ApplicationForm, { FormSchema } from "@/components/new-application";

interface ApplicationTableRowProps {
  app: Application;
  onUpdate: (id: string, values: FormSchema) => Promise<boolean>;
  onDelete: (id: string) => void;
  fetchApplications: () => Promise<void>;
}

const ApplicationTableRow: React.FC<ApplicationTableRowProps> = ({
  app,
  onUpdate,
  onDelete,
  fetchApplications,
}) => {
  const [isUpdatedAppDialogOpen, setUpdatedAppDialogOpen] = useState(false);

  return (
    <TableRow key={app.id}>
      <TableCell>
        <a
          href={app.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Job Link
        </a>
      </TableCell>
      <TableCell>{app.company}</TableCell>
      <TableCell>{app.role}</TableCell>
      <TableCell>{app.country}</TableCell>
      <TableCell>{app.type}</TableCell>
      <TableCell>{app.location}</TableCell>
      <TableCell>
        <Badge className={mapStatusToBadge(app.status)}>{app.status}</Badge>
      </TableCell>
      <TableCell>{formatDate(app.applicationDate)}</TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-pointer">
                {app.notes.length > 50
                  ? `${app.notes.substring(0, 50)}...`
                  : app.notes}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-[500px] bg-gray-600 text-white text-lg overflow-scroll max-h-[40vh]">
              <p>{app.notes}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        <div className="flex gap-2 items-center">
          <Dialog
            open={isUpdatedAppDialogOpen}
            onOpenChange={setUpdatedAppDialogOpen}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setUpdatedAppDialogOpen(true)}>
                Update
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Application {app.id}</DialogTitle>
              </DialogHeader>
              <ApplicationForm
                onSuccess={() => setUpdatedAppDialogOpen(false)}
                fetchApplications={fetchApplications}
                submitApi={(values: FormSchema) => onUpdate(app.id, values)}
                defaultValues={app as FormSchema}
              />
              <DialogClose asChild>
                <Button variant="ghost">Close</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
          <Button onClick={() => onDelete(app.id)} variant="destructive">
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ApplicationTableRow;
