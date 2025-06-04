"use server";

import Interaction, { IInteractionDoc } from "@/database/interaction.model";
import {
  CreateInteractionParams,
  UpdateInteractionParams,
} from "@/types/action";
import { ActionResponse, ErrorResponse } from "@/types/global";
import mongoose from "mongoose";
import action from "../handlers/action";
import { CreateInteractionSchema } from "../vaildations";
import handleError from "../handlers/error";
import { User } from "@/database";

export async function createInteraction(
  params: CreateInteractionParams,
): Promise<ActionResponse<IInteractionDoc>> {
  const validationResult = await action({
    params,
    schema: CreateInteractionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const {
    action: actionType,
    actionTarget,
    actionId,
    authorId,
  } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const interaction = await Interaction.create(
      [
        {
          user: userId,
          action: actionType,
          actionId,
          actionType: actionTarget,
        },
      ],
      { session },
    );
    await updateInteraction({
      interaction: interaction[0],
      session,
      performerId: userId!,
      authorId,
    });
    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(interaction)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

async function updateInteraction(params: UpdateInteractionParams) {
  const { interaction, session, performerId, authorId } = params;

  const { action, actionType } = interaction;

  let preformerPoints = 0;
  let authorPoints = 0;

  switch (action) {
    case "upvote":
      preformerPoints = 2;
      authorPoints = 10;
      break;
    case "downvote":
      preformerPoints = -1;
      authorPoints = -2;
      break;
    case "post":
      authorPoints = actionType === "question" ? 5 : 10;
      break;
    case "delete":
      authorPoints = actionType === "question" ? -5 : -10;
      break;
  }

  if (performerId === authorId) {
    await User.findByIdAndUpdate(
      performerId,
      { $inc: { reputation: authorPoints } },
      { session },
    );
    return;
  }
  await User.bulkWrite(
    [
      {
        updateOne: {
          filter: { _id: performerId },
          update: { $inc: { reputation: preformerPoints } },
        },
      },
      {
        updateOne: {
          filter: { _id: authorId },
          update: { $inc: { reputation: authorPoints } },
        },
      },
    ],
    { session },
  );
}
