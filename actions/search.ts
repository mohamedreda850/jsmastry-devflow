"use server";

import connectToDatabase from "@/lib/mongoose";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";

export async function globalSearch(params: { query?: string; type?: string }) {
  try {
    await connectToDatabase();
    const { query, type } = params;

    if (!query) {
      return [];
    }

    const regexQuery = { $regex: query, $options: "i" };

    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    const results = [];

    // If type is specified, only search in that model
    if (type) {
      const modelInfo = modelsAndTypes.find((item) => item.type === type);
      if (!modelInfo) {
        return [];
      }

      const queryResults = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(2);

      results.push(
        ...queryResults.map((item) => ({
          title:
            type === "answer"
              ? `Answers containing ${query}`
              : item[modelInfo.searchField],
          type,
          id:
            type === "answer" ? item.question.toString() : item._id.toString(),
        }))
      );
    } else {
      // Search across all models
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2);

        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id:
              type === "answer"
                ? item.question.toString()
                : item._id.toString(),
          }))
        );
      }
    }

    return results;
  } catch (error) {
    console.error("Error in global search:", error);
    throw error;
  }
}
