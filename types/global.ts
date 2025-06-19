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

export interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

export type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

export type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
export type ErrorResponse = ActionResponse<undefined> & { success: false };
export type APIErrorResponse = NextResponse<ErrorResponse>;
export type APIResponse<T = null> = NextResponse<
  SuccessResponse<T> | ErrorResponse
>;

export interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

export interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
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
