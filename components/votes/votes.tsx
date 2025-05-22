"use client";
import Image from "next/image";
import upvote from "@/public/icons/upvote.svg";
import upvoteed from "@/public/icons/upvoted.svg";
import downvote from "@/public/icons/downvote.svg";
import downvoted from "@/public/icons/downvoted.svg";
import { use, useState } from "react";
import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { ActionResponse } from "@/types/global";
import { HasVotedResponse } from "@/types/action";
import { createVote } from "@/lib/actions/vote.action";
interface Params {
  targetType: "question" | "answer";
  targetId: string;
  upvotes: number;
  downvotes: number;
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>
}
const Votes = ({ upvotes,  downvotes,  hasVotedPromise, targetType, targetId}: Params) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const {success, data} = use(hasVotedPromise)
  const [isLoading, setIsLoading] = useState(false);
  const {hasUpvoted, hasDownvoted} = data || {}
  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId)
      return toast({
        title: "Please log in to vote",
        description: "only logged in users can vote",
      });
    setIsLoading(true);
    try {

        const results = await createVote({
            targetId,
            targetType,
            voteType,
        })
        if(!results.success){
            toast({
                title: "Failed to vote",
                description: results.error?.message || "An error occurred while voting. Please try again later.",
                variant: "destructive",
              });
        }
      const successMessage =
        voteType === "upvote"
          ? `Upvote${!hasUpvoted ? "added" : "removed"}`
          : `Downvote${!hasDownvoted ? "added" : "removed"}`;
      toast({
        title: successMessage,
        description: "Your vote has been successfully registered",
      });
    } catch {
      toast({
        title: "Failed to vote",
        description: "An error occurred while voting. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className=" flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={success && hasUpvoted ? upvoteed : upvote}
          width={18}
          height={18}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>
      <div className="flex-center gap-1.5">
        <Image
          src={success && hasDownvoted ? downvoted : downvote}
          width={18}
          height={18}
          alt="downvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
