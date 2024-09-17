"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectValue } from "@radix-ui/react-select";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  link: z.string().url({ message: "Please enter a valid URL" }),
  role: z.string().min(2, { message: "Role must be at least 2 characters" }),
  type: z.string().min(2, { message: "Type must be at least 2 characters" }),
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters" }),
  status: z.enum([
    "TO_APPLY",
    "PENDING",
    "CANCELED",
    "REFUSED",
    "IN_INTERVIEWS",
  ]),
  notes: z.string(),
  company: z.string(),
});

export type FormSchema = z.infer<typeof formSchema>;

interface ApplicationsFormProps {
  fetchApplications: () => void;
  defaultValues?: FormSchema;
  submitApi: (values: FormSchema) => Promise<boolean>;
  onSuccess: () => void;
}

const ApplicationForm: React.FC<ApplicationsFormProps> = ({
  fetchApplications,
  submitApi,
  defaultValues,
  onSuccess,
}) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      link: "",
      role: "",
      company: "",
      type: "",
      location: "",
      status: "TO_APPLY",
      notes: "",
    },
  });
  const onSubmit: SubmitHandler<FormSchema> = async (values) => {
    const ok = await submitApi(values);
    if (ok) {
      form.reset();
      fetchApplications();
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Link</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>The URL of the job posting</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Google" {...field} />
              </FormControl>
              <FormDescription>The name of the company</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input placeholder="Software Engineer" {...field} />
              </FormControl>
              <FormDescription>The role you are applying for</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input placeholder="Full-time" {...field} />
              </FormControl>
              <FormDescription>
                The type of job (e.g., Full-time, Part-time)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl className="bg-none">
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="On-site">On-site</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>The location of the job</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TO_APPLY">To Apply</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CANCELED">Canceled</SelectItem>
                    <SelectItem value="REFUSED">Refused</SelectItem>
                    <SelectItem value="IN_INTERVIEWS">In Interviews</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                The current status of your application
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nice interview, good company, goog review, bad salary...."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Some notes for you to (e.g., Full-time, Part-time)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {defaultValues ? "Update" : "Create"} Application
        </Button>
      </form>
    </Form>
  );
};

export default ApplicationForm;
