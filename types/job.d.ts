export type JobType =
  | "full-time"
  | "part-time"
  | "Remote"
  | "On-Site"
  | "Hybrid"
  | "Contract"
  | "Internship"
  | "Freelance"
  | "Temporary"
  | "Volunteer";

export interface JobFilter {
  name: string;
  value: JobType;
}
