import { model, models, Schema, Types } from 'mongoose';


export interface IAnswer{
    auther : Types.ObjectId;
    question: Types.ObjectId;
    content:string;
    upvotes:number;
    downvotes:number;

}

const answerSchema = new Schema<IAnswer>({
auther:{ type: Schema.Types.ObjectId, ref: "User" , required: true },
question:{ type: Schema.Types.ObjectId,ref:"Question", required: true },
content:{ type: String, required: true },
upvotes:{type:Number, default:0},
downvotes:{type:Number, default:0},

},{ timestamps: true })

const Ansewr = models.answer || model<IAnswer>("Answer", answerSchema);
export default Ansewr;