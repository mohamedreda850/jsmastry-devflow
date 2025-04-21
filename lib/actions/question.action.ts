"use server"

import { ActionResponse, ErrorResponse } from "@/types/global";
import { AskQuestionSchema } from "../vaildations";
import action from "../handlers/action";
import handleError from "../handlers/error";
import  mongoose  from "mongoose";
import Question from "@/database/question.model";
import Tag from '@/database/tag.model';
import TagQuestion from '@/database/tag-question.model';


export async function createQuestion(params:creatQuestionParams) : Promise<ActionResponse<Question>>{
    const validatedResult = await action({params , schema : AskQuestionSchema , authorize:true})

    if(validatedResult instanceof Error){
        return handleError(validatedResult) as ErrorResponse
    }
    const {title , content, tags} =validatedResult.params!
    const userId = validatedResult?.session?.user?.id
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const [question] = await Question.create([{title,content,author: userId}] , {session})
        if(!question){
            throw new Error("Failed to create question")
        }
        const tagIds : mongoose.Types.ObjectId[]=[];
        const tagQuestionDocuments = [];
        for(const tag of tags){
            const existingTag = await Tag.findOneAndUpdate({name:{$regex: new RegExp(`^${tag}$` , 'i')}},
        {$setOnInsert:{name:tag},$inc:{question: 1}},
        {upsert:true , new:true , session}
        );
        tagIds.push(existingTag._id);
        tagQuestionDocuments.push({tag:existingTag._id,question:question._id})
        }

        await TagQuestion.insertMany(tagQuestionDocuments , {session})
        await Question.findByIdAndUpdate(question._id,{$push:{tags:{$each : tagIds}}}
            ,{session}
        )
        await session.commitTransaction()
        return {success: true ,data:JSON.parse(JSON.stringify(question)) }
    } catch (error) {
        if(error) await session.abortTransaction()
        return handleError(error) as ErrorResponse
    }finally {
        session.endSession()
    }
}