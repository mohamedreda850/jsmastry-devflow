import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import TagCards from "./TagCard";
import Metric from "../Metric";
import likeIcon from "./../../public/icons/like.svg"
import messageIcon from "./../../public/icons/message.svg"
import eyeIcon from "./../../public/icons/eye.svg"
interface Props {
  question: Question;
}
const QuestionCard = ({
  question: { _id, title, author, tags, createdAt, upvotes, answers, views },
}: Props) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11 ">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={ROUTES.QUESTION(_id)}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light800 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
      </div>
      <div className="flex mt-3.5 w-full flex-wrap gap-2">
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
            value={views}
            title="views"
            textStyles="small-medium text-dark400_light800"
            />

        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
