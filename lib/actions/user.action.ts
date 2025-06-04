"use server";

import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  Question as QuestionType,
  User,
  Answer as AnswerType,
  BadgeCounts,
} from "@/types/global";

import action from "../handlers/action";
import {
  GetUserAnswersSchema,
  GetUserQuestionsSchema,
  GetUserSchema,
  GetUserTagsSchema,
  PaginatedSearchPaamsSchema,
} from "../vaildations";
import handleError from "../handlers/error";
import { FilterQuery, PipelineStage, Types } from "mongoose";
import { Question, User as UserModel } from "@/database";
import Answer from "@/database/answer.model";
import {
  GetUserAnswersParams,
  GetUserParams,
  GetUserQuestionsParams,
  GetUserTagsParams,
} from "@/types/action";
import { assignBadges } from "../utils";

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

export const getUser = async (
  params: GetUserParams,
): Promise<
  ActionResponse<{ user: User; totalQuestions: number; totalAnswers: number }>
> => {
  const validationResult = action({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { userId } = params;

  try {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error("User not found");

    const totalQuestions = await Question.countDocuments({
      author: userId,
    });
    const totalAnswers = await Answer.countDocuments({
      author: userId,
    });

    return {
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
};

export const getUserQuestions = async (
  params: GetUserQuestionsParams,
): Promise<ActionResponse<{ questions: QuestionType[]; isNext: boolean }>> => {
  const validationResult = action({
    params,
    schema: GetUserQuestionsSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { userId, page = 1, pageSize = 10 } = params;

  const skip = (Number(page) - 1) * pageSize;

  const limit = pageSize;

  try {
    const totalQuestions = await Question.find({
      author: userId,
    });
    const questions = await Question.find({
      author: userId,
    })
      .populate("tags", "name")
      .populate("author", "name image")
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions.length > skip + limit;

    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
export const getUserAnswers = async (
  params: GetUserAnswersParams,
): Promise<ActionResponse<{ answers: AnswerType[]; isNext: boolean }>> => {
  const validationResult = action({
    params,
    schema: GetUserAnswersSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { userId, page = 1, pageSize = 10 } = params;

  const skip = (Number(page) - 1) * pageSize;

  const limit = pageSize;

  try {
    const totalAnswers = await Answer.find({
      author: userId,
    });
    const answers = await Answer.find({
      author: userId,
    })
      .populate("author", "name image")
      .skip(skip)
      .limit(limit);

    const isNext = totalAnswers.length > skip + limit;

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getUserTopTags = async (
  params: GetUserTagsParams,
): Promise<
  ActionResponse<{ tags: { _id: string; name: string; count: number }[] }>
> => {
  const validationResult = action({
    params,
    schema: GetUserTagsSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { userId } = params;

  try {
    const pipeline: PipelineStage[] = [
      { $match: { author: new Types.ObjectId(userId) } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo",
        },
      },
      { $unwind: "$tagInfo" },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: "$tagInfo._id",
          name: "$tagInfo.name",
          count: 1,
        },
      },
    ];

    const tags = await Question.aggregate(pipeline);
    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getUserStats = async (
  params: GetUserParams,
): Promise<
  ActionResponse<{
    totalQuestions: number;
    totalAnswers: number;
    badges: BadgeCounts;
  }>
> => {
  const validationResult = action({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { userId } = params;

  try {
    const [questionState] = await Question.aggregate([
      {
        $match: {
          author: new Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          upvote: { $sum: "$upvotes" },
          views: { $sum: "$views" },
        },
      },
    ]);

    const [answerState] = await Answer.aggregate([
      {
        $match: {
          author: new Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          upvote: { $sum: "$upvotes" },
        },
      },
    ]);
    const badges = assignBadges({
      criteria: [
        { type: "QUESTION_COUNT", count: questionState?.count },
        { type: "ANSWER_COUNT", count: answerState?.count },
        { type: "QUESTION_UPVOTES", count: questionState?.upvote },
        { type: "ANSWER_UPVOTES", count: answerState?.upvote },
      ],
    });
    return {
      success: true,
      data: {
        totalQuestions: questionState?.count,
        totalAnswers: answerState?.count,
        badges,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
