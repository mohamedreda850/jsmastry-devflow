import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import TagCards from "./TagCard";
import Metric from "../Metric";
import likeIcon from "./../../public/icons/like.svg";
import messageIcon from "./../../public/icons/message.svg";
import eyeIcon from "./../../public/icons/eye.svg";
import { Question, Tag } from "@/types/global";
import EditDeleteAction from "../user/EditDeleteAction";
interface Props {
  question: Question;
  showActionBtns?: boolean;
}
const QuestionCard = ({
  question: { _id, title, author, tags, createdAt, upvotes, answers, view },
  showActionBtns = false,
}: Props) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11 ">
      <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row">
        <div className="flex-1">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={ROUTES.QUESTION(_id)}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light800 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {showActionBtns && <EditDeleteAction type="question" itemId={_id} />}
      </div>
      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCards key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.image}
          alt={author.name}
          value={author.name}
          title={`• asked ${getTimeStamp(createdAt)} `}
          href={ROUTES.PROFILE(author._id)}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl={likeIcon}
            alt="like"
            value={upvotes}
            title="votes"
            textStyles="small-medium text-dark400_light800"
            isAuthor
            titleStyles="max-sm:hidden"
          />
          <Metric
            imgUrl={messageIcon}
            alt="answers"
            value={answers}
            title="answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl={eyeIcon}
            alt="views"
            value={view}
            title="views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
