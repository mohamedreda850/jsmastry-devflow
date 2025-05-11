import ROUTES from "@/constants/routes";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { cn, getDeviconClassName, getTechDescription } from "@/lib/utils";
import Image from "next/image";
import imgClose from "./../../public/icons/close.svg";
interface Props {
  _id: string;
  name: string;
  question?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handelRemove?: () => void;
}
const TagCards = ({
  _id,
  name,
  question,
  showCount,
  compact,
  remove,
  isButton,
  handelRemove,
}: Props) => {
  const iconClass = getDeviconClassName(name);
  const iconDescription = getTechDescription(name);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };
  const Content = (
    <>
      {" "}
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase flex flex-row gap-2">
        <div className="flex-center space-x-2">
          <i className={`${iconClass} text-sm`}></i>
          <span>{name}</span>
        </div>
        {remove && (
          <Image
            src={imgClose}
            alt="close tag"
            width={12}
            height={12}
            className="cursor-pointer object-contain invert-0 dark:invert "
            onClick={handelRemove}
          />
        )}
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700">{question}</p>
      )}
    </>
  );
  if (compact) {
    return isButton ? (
      <button onClick={handleClick} className="flex justify-between gap-2">
        {Content}
      </button>
    ) : (
      <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
        {Content}
      </Link>
    );
  }
  return (
    <Link href={ROUTES.TAG(_id)} className="shadow-light100_darknone">
      <article className="background-light900_dark200 light-border flex w-full flex-col rounded-md border px-8 py-10 sm:w-[260px]">
        <div className="flex items-center justify-between gap-3">
          <div className="background-light800_dark400 w-fit rounded-sm px-5 py-2.5">
            <p className="paragraph-semibold text-dark300_light900">{name}</p>
          </div>
          <i className={cn(iconClass, "text-2xl")} aria-hidden="true" />
        </div>
        <p className="small-regular text-dark500_light700 mt-5 line-clamp-3 w-full">
          {iconDescription}
        </p>
        <p className="small-medium text-dark400_light500 mt-3.5">
          <span className="body-semibold primary-text-gradient mr-2.5">
            {question}+
          </span>
          Questions
        </p>
      </article>
    </Link>
  );
};

export default TagCards;
