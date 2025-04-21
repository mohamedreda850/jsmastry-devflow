import { Document, model, models, Schema, Types } from "mongoose";

export interface IVote {
  author: Types.ObjectId;
  actionId: Types.ObjectId;
  type: "question" | "aswer";
  voteType: "upvote" | "downvote";
}
export interface IVoteDoc extends IVote, Document {}
const voteSchema = new Schema<IVote>({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  actionId: { type: Schema.Types.ObjectId, required: true },
  type: { type: String, enum: ["question", "answer"], required: true },
  voteType: { type: String, enum: ["upvote", "downvote"], required: true },
});
const Vote = models.Vote || model<IVote>("Vote", voteSchema);
export default Vote;
