"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import starImage from './../../public/icons/star-filled.svg'
import starRedImage from './../../public/icons/star-red.svg'
import { toast } from "@/hooks/use-toast";
import { togaleSaveQuestion } from "@/lib/actions/collection.action";
const SaveQuestion = ({questionId}: {questionId: string}) => {
    const session = useSession();
    const userId = session?.data?.user?.id;

    const [isLoading, setIsLoading] = useState(false)

    const handelSave = async () => {
        if(isLoading) return;
        if(!userId){
            return toast({
                title: "You need to be logged in to save a question",
                variant: "destructive"
            });

        }
        setIsLoading(true)
        try {
          const {success, data, error} = await togaleSaveQuestion({questionId})
          if(!success){
            throw new Error(error?.message) || "Something went wrong"
          }
          toast({
            title: `Question ${data?.saved ? "saved" : "removed"}`,
          })
        } catch (error) {
            toast({
                title:"Error",
                description: error instanceof Error ? error.message : "Something went wrong",
                variant: "destructive"
            })
        }finally{
            setIsLoading(false)
        }
    }

    const hasSaved = false ;
  return (
    <Image
    src={hasSaved ?  starImage:  starRedImage}
    alt="save"
    width={18}
    height={18}
    className={`cursor-pointer ${isLoading && 'opacity-50' }`}
    aria-label="save question"
    onClick={handelSave}
    />
  )
}

export default SaveQuestion
