import { model, models, Schema, Types } from "mongoose";

export interface IVote{
author:Types.ObjectId;
id:Types.ObjectId;
type:"question"|"aswer";
voteType:"upvote"|"downvote";
}

const voteSchema = new Schema<IVote>({
    author :{ type: Schema.Types.ObjectId, ref: "User" , required: true },
    id:{type:Schema.Types.ObjectId, required:true},
    type:{type:String, enum:["question", "answer"], required:true},
    voteType:{type:String, enum:["upvote", "downvote"], required:true},
})
const Vote = models.vote || model<IVote>("Vote", voteSchema);
export default Vote;