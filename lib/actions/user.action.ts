"use server";

import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  User,
} from "@/types/global";
import action from "../handlers/action";
import { GetUserSchema, PaginatedSearchPaamsSchema } from "../vaildations";
import handleError from "../handlers/error";
import { FilterQuery } from "mongoose";
import { Question, User as UserModel } from "@/database";
import Answer from "@/database/answer.model";
import { GetUserParams } from "@/types/action";

export async function getUsers(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    users: User[];
    isNext: boolean;
  }>
> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchPaamsSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { page = 1, pageSize = 10, query, filter } = params;

  const skip = (Number(page) - 1) * pageSize;

  const limit = pageSize;

  const filterQuery: FilterQuery<typeof UserModel> = {};

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
      { username: { $regex: query, $options: "i" } },
    ];
  }

  let sortQriteria = {};

  switch (filter) {
    case "newest":
      sortQriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortQriteria = { createdAt: 1 };
      break;
    case "popular":
      sortQriteria = { reputation: -1 };
      break;
    default:
      sortQriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalUsers = await UserModel.countDocuments(filterQuery);

    const users = await UserModel.find(filterQuery)
      .sort(sortQriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalUsers > skip + limit;

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export const getUser = async (params: GetUserParams): Promise<ActionResponse<{user: User, totalQuestions: number, totalAnswers: number}>> => {

  const validationResult = action({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const {userId} = params;

  try {
    const user = await UserModel.findById(userId);
    if(!user) throw new Error("User not found");

    const totalQuestions = await Question.countDocuments({
      author: userId,
    });
    const totalAnswers = await Answer.countDocuments({
      author: userId,
    })

    return{
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        totalQuestions,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
    
}

