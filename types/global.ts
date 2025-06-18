import { AbsoluteString } from "next/dist/lib/metadata/types/metadata-types";
import { NextResponse } from "next/server";

export interface Tag {
  _id: string;
  name: string;
  questions?: number;
}
export interface Author {
  _id: string;
  name: string;
  image: string;
}
export interface Question {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  answers: number;
  view: number;
}

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};
type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };
type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

export interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: AbsoluteString;
  filter?: string;
  sort?: string;
}

export interface Answer {
  _id: string;
  author: Author;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  question: string;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
  createdAt: Date;
}

export interface Collection {
  _id: string;
  question: Question;
  author: string | Author;
}

export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}
