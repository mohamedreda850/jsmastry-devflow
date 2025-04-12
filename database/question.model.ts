import { Document, model, models, Schema, Types } from "mongoose";


export interface IQuestion{
title:string;
content:string;
tags:Types.ObjectId[];
view:number;
upvotes:number;
downvotes:number;
answers:number;
auther:Types.ObjectId;
}
export interface IQuestionDoc extends IQuestion, Document {}
const questionSchema = new Schema<IQuestion>({
title: { type: String, required: true },
content:{ type: String, required: true },
tags:[{type:Schema.Types.ObjectId, ref:"Tag"}],
view:{type:Number, default:0},
upvotes:{type:Number, default:0},
downvotes:{type:Number, default:0},
answers:{type:Number, default:0},
auther:{type:Schema.Types.ObjectId, ref:"User" , required: true },
},{ timestamps: true })

const Question = models?.question || model<IQuestion>("Question", questionSchema);
export default Question;