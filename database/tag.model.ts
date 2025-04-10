import { model, models, Schema } from "mongoose";

export interface ITag{
name:string;
question:number
} 

const tagSchema = new Schema<ITag>({
name:{type:String,required:true , unique:true},
question:{type:Number, default:0},
},{ timestamps: true })
const Tag = models?.tag||model<ITag>("Tag", tagSchema)
export default Tag;
