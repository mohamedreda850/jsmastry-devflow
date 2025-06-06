import { IInteractionDoc } from "@/database/interaction.model";
import { PaginatedSearchParams } from "./global";
import mongoose from "mongoose";
import { JobType } from "./job";

interface signinWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    email: string;
    name: string;
    image: string;
    username: string;
  };
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface CreatQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends CreatQuestionParams {
  questionId: string;
}

interface GetQuestionParams {
  questionId: string;
}

interface GetTagQuestionParams extends Omit<PaginatedSearchParams, "filter"> {
  tagId: string;
}

interface IncrementViewsParams {
  questionId: string;
}

interface CreateAnswerParams {
  questionId: string;
  content: string;
}

interface GetAnswerParams extends PaginatedSearchParams {
  questionId: string;
}

interface CreateVoteParams {
  targetId: string;
  targetType: "question" | "answer";
  voteType: "upvote" | "downvote";
}

interface UpdateVoteCountParams extends CreateVoteParams {
  change: 1 | -1;
}

type HasVotedParams = Pick<CreateVoteParams, "targetId" | "targetType">;

interface HasVotedResponse {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}

interface CollectionBaseParams {
  questionId: string;
}

interface GetUserParams {
  userId: string;
}

interface GetUserQuestionsParams
  extends Omit<PaginatedSearchParams, "query" | "filter" | "sort"> {
  userId: string;
}

interface GetUserAnswersParams
  extends Omit<PaginatedSearchParams, "query" | "filter" | "sort"> {
  userId: string;
}

interface GetUserTagsParams {
  userId: string;
}

interface DeleteQuestionParams {
  questionId: string;
}

interface DeleteAnswerParams {
  answerId: string;
}

interface CreateInteractionParams {
  action:
    | "view"
    | "upvote"
    | "downvote"
    | "bookmark"
    | "post"
    | "edit"
    | "delete"
    | "search";
  actionTarget: "question" | "answer";
  actionId: string;
  authorId: string;
}

interface UpdateInteractionParams {
  interaction: IInteractionDoc;
  session: mongoose.ClientSession;
  performerId: string;
  authorId: string;
}

interface RecommendationParams {
  userId: string;
  query?: string;
  skip?: number;
  limit?: number;
}

interface CreateJobParams {
  title: string;
  company: string;
  location: string;
  type: JobType;
  salary?: string;
  logoUrl?: string;
  applyUrl: string;
  description: string;
}
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

export interface GetJobParams {
  jobId: string;
}
// ... existing code ...

export type UpdateUserParams = {
  userId: string;
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
};

// ... existing code ...