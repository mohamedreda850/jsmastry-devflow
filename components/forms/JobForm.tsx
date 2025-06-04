"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IJob } from "@/database/Job.model";
import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { JobSchema, JobTypeEnum } from "@/lib/vaildations";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import { createJobAction } from "@/lib/actions/job.action";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type JobFormValues = z.infer<typeof JobSchema>;

interface JobFormProps {
  jobDetails?: Partial<IJob>;
}

const JobForm = ({ jobDetails }: JobFormProps) => {
  const router = useRouter();
  const form = useForm<JobFormValues>({
    resolver: zodResolver(JobSchema),
    defaultValues: {
      title: jobDetails?.title ?? "",
      company: jobDetails?.company ?? "",
      location: jobDetails?.location ?? "",
      type: (jobDetails?.type as JobFormValues["type"]) ?? "full-time",
      salary: jobDetails?.salary ?? "",
      logoUrl: jobDetails?.logoUrl ?? "",
      applyUrl: jobDetails?.applyUrl ?? "",
      description: jobDetails?.description ?? "",
    },
  });

  const onSubmit = async (data: JobFormValues) => {
    const result = await createJobAction(data);
    if (result.success) {
      router.push(ROUTES.JOBS);
      toast({
        title: "Job added successfully",
        description: "Your job has been added successfully",
      });
    } else {
      toast({
        title: "Failed to add job",
        description: result.error?.message || "Failed to add job",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Job Title" />
              </FormControl>
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
                <Input {...field} placeholder="Company" />
              </FormControl>
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
              <FormControl>
                <Input {...field} placeholder="Location" />
              </FormControl>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job type" />
                  </SelectTrigger>
                </FormControl>
                
                <SelectContent>

                  {JobTypeEnum.options.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salary</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Salary" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Logo URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applyUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apply URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Apply URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Description" className="min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500 text-white" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Adding..." : "Add Job"}
        </Button>
      </form>
    </Form>
  );
};

export default JobForm;
