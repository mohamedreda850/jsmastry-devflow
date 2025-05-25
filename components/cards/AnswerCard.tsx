import { Answer } from "@/types/global";
import React, { Suspense } from "react";
import UserAvatar from "../userAvatar";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { cn, getTimeStamp } from "@/lib/utils";
import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";
import Votes from "../votes/votes";
import { hasVoted } from "@/lib/actions/vote.action";
import EditDeleteAction from "../user/EditDeleteAction";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

const Preview = ({ content }: { content: string }) => {
  const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");

  return (
    <section className="markdown prose grid break-words">
      <MDXRemote
        source={formattedContent}
        components={{
          pre: (props) => (
            <Code
              {...props}
              lineNumbers
              className="shadow-light-200 dark:shadow-dark-200"
            />
          ),
        }}
      />
    </section>
  );
};
interface Props extends Answer {
  containerClasses?: string;
  showReadMore?: boolean;
  showActionBtns?: boolean;
}
const AnswerCard = ({
  _id,
  content,
  createdAt,
  author,
  upvotes,
  downvotes,
  question,
  containerClasses,
  showReadMore,
  showActionBtns = false,
}: Props) => {
  const hasVotedPromise = hasVoted({ targetId: _id, targetType: "answer" });
  return (
    <article className={cn("light-border relative border-b py-10", containerClasses)}>
      <span id={`answer-${_id}`} className="hash-span" />
      {showActionBtns && (
        <div className="background-light800 flex-center  absolute -right-2 -top-5 size-9 eounded-[100%]">
          <EditDeleteAction type="answer" itemId={_id} />
        </div>
      )}
      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-1 sm:items-center">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageUrl={author.image}
            className="size-5 rounded-[100%] object-cover max-sm:mt-2"
          />
          <Link
            href={ROUTES.PROFILE(author._id)}
            className="flex flex-col max-sm:ml-1 sm:flex-row sm:items-center"
          >
            <p className="body-semibold text-dark300_light700">
              {author.name ?? "Anonymous"}
            </p>
            <p className="small-regular text-light400_light500 ml-0.5 line-clamp-1">
              <span className="max-sm:hidden">&bull;</span>
              answered {getTimeStamp(createdAt)}
            </p>
          </Link>
        </div>
        <div className="flex justify-end">
          <Suspense fallback={<div>Loading...</div>}>
            <Votes
              upvotes={upvotes}
              targetType="answer"
              targetId={_id}
              downvotes={downvotes}
              hasVotedPromise={hasVotedPromise}
            />
          </Suspense>
        </div>
      </div>
      <Preview content={content} />
      {showReadMore && (
        <Link
          href={`/questions/${question}#answer-${_id}`}
          className="body-semibold relative z-10 font-space-grotesk text-primary-500"
        >
          <p className="mt-1">Read More...</p>
        </Link>
      )}
    </article>
  );
};

export default AnswerCard;
