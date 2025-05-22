"use server"


import { ActionResponse, ErrorResponse, PaginatedSearchParams, User } from "@/types/global";
import action from "../handlers/action";
import { PaginatedSearchPaamsSchema } from "../vaildations";
import handleError from "../handlers/error";
import { FilterQuery } from "mongoose";
import { User as UserModel } from "@/database";

export async function getUsers(params: PaginatedSearchParams): Promise<ActionResponse<{
    users:User[], isNext:boolean
}>>{
   const validationResult = await action({
    params,
    schema: PaginatedSearchPaamsSchema,
   });

   if(validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

   const{page= 1, pageSize= 10, query, filter} = params;

   const skip = (Number(page) -1) * pageSize;

   const limit = pageSize;

   const filterQuery : FilterQuery<typeof UserModel> = {};

   if(query) {
    filterQuery.$or = [
        {name: {$regex: query, $options: "i"}},
        {email: {$regex: query, $options: "i"}},
    ]
   }

   let sortQriteria = {};

   switch(filter){
    case "newest":
        sortQriteria = {createdAt: -1};
        break;
    case "oldest":
        sortQriteria = {createdAt: 1};
        break;
    case "popular":
        sortQriteria = {reputation: -1};
        break;
    default:
        sortQriteria = {createdAt: -1};
        break;
   }

   try {
    const totalUsers = await UserModel.countDocuments(filterQuery);

    const users = await UserModel.find(filterQuery)
    .sort(sortQriteria)
    .skip(skip)
    .limit(limit)
    
    const isNext = totalUsers > skip + limit;
    
    return{
       success: true,
       data: {
        users: JSON.parse(JSON.stringify(users)),
        isNext,
       }
    }
    
   } catch (error) {
    return handleError(error) as ErrorResponse;
   }
   
}