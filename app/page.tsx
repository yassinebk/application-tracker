"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ApplicationForm, { FormSchema } from "@/components/new-application";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

import useKeyboardShortcut from "use-keyboard-shortcut";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Application {
  id: string;
  link: string;
  company: string;
  role: string;
  type: string;
  location: string;
  status: string;
  applicationDate: string;
  notes: string;
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isNewAppDialogOpen, setNewApplicationDialogOpen] = useState(false);
  const [isUpdatedAppDialogOpen, setUpdatedAppDialogOpen] = useState(false);

  const router = useRouter();

  const { data: session, status } = useSession();
  useKeyboardShortcut(["A"], () => setNewApplicationDialogOpen(true), {
    overrideSystem: false,
    ignoreInputFields: true,
    repeatOnHold: false,
  });

  const fetchApplications = async () => {
    const res = await fetch("/api/applications");
    const data: Application[] = await res.json();
    setApplications(data);
  };

  const createApplication = async (values: FormSchema) => {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    return res.ok;
  };
  const updateApplication = async (id: string, values: FormSchema) => {
    const res = await fetch("/api/applications", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, id: id }),
    });
    return res.ok;
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (session) {
      fetchApplications();
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[50vw] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[50vw]" />
            <Skeleton className="h-4 w-[50vw]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Job Application Tracker</CardTitle>
          <CardDescription>Signed in as {session?.user?.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 align-items-center">
            <Button onClick={() => signOut()}>Sign out</Button>
            <Dialog
              open={isNewAppDialogOpen}
              onOpenChange={(open) => {
                setNewApplicationDialogOpen(open);
              }}
            >
              <DialogTrigger asChild>
                <Button>Add Application</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle autoFocus>Add New Application</DialogTitle>
                  <DialogDescription>
                    Fill in the details of the new job application.
                  </DialogDescription>
                </DialogHeader>
                <ApplicationForm
                  onSuccess={() => setNewApplicationDialogOpen(false)}
                  fetchApplications={fetchApplications}
                  submitApi={createApplication}
                />
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    onClick={() => setNewApplicationDialogOpen(false)}
                  >
                    Close
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Link</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Application Date</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
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

                  <TableCell>{app.type}</TableCell>
                  <TableCell>{app.location}</TableCell>
                  <TableCell>
                    <Badge className={mapStatusToBadge(app.status)}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(app.applicationDate)}</TableCell>
                  <TableCell>{app.notes}</TableCell>
                  <TableCell>
                    <Dialog
                      open={isUpdatedAppDialogOpen}
                      onOpenChange={(open) => setUpdatedAppDialogOpen(open)}
                    >
                      <DialogTrigger asChild>
                        <Button>Update</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle autoFocus>
                            Update Application {app.id}
                          </DialogTitle>
                        </DialogHeader>
                        <ApplicationForm
                          onSuccess={() => setUpdatedAppDialogOpen(false)}
                          fetchApplications={fetchApplications}
                          submitApi={(values: FormSchema) =>
                            updateApplication(app.id, values)
                          }
                          defaultValues={app as FormSchema}
                        />
                        <DialogClose asChild>
                          <Button variant="ghost">Close</Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

const mapStatusToBadge = (status: string) => {
  switch (status) {
    case "TO_APPLY":
      return "bg-gray-200 text-gray-800";
    case "PENDING":
      return "bg-yellow-200 text-yellow-800";
    case "CANCELED":
      return "bg-red-200 text-red-800";
    case "REFUSED":
      return "bg-red-500 text-white";
    case "IN_INTERVIEWS":
      return "bg-blue-200 text-blue-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};
