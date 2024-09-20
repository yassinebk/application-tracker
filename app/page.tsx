"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import useKeyboardShortcut from "use-keyboard-shortcut";

import { Button } from "@/components/ui/button";

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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import ApplicationForm, { FormSchema } from "@/components/new-application";
import ApplicationTableRow from "@/components/applications-table-row";
import {
  Application,
} from "@/lib/types";
import Loading from "@/components/loading";
import ApplicationsFilter from "@/components/applications-filter";

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<
    Application[]
  >([]);
  const [isNewAppDialogOpen, setNewApplicationDialogOpen] = useState(false);
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
    setFilteredApplications(data);
  };

  const createApplication = async (values: FormSchema) => {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      await fetchApplications();
    }
    return res.ok;
  };

  const updateApplication = async (id: string, values: FormSchema) => {
    const res = await fetch("/api/applications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, id }),
    });
    if (res.ok) {
      await fetchApplications();
    }
    return res.ok;
  };

  const deleteApplication = async (id: string) => {
    const res = await fetch(`/api/applications?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchApplications();
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    } else if (session) {
      fetchApplications();
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="mx-auto p-4">
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
              onOpenChange={setNewApplicationDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>Add Application</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Application</DialogTitle>
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
          <ApplicationsFilter applications={applications} setApplications={setFilteredApplications} />
  
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Link</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Application Date</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <ApplicationTableRow
                  key={app.id}
                  app={app}
                  onUpdate={updateApplication}
                  onDelete={deleteApplication}
                  fetchApplications={fetchApplications}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
