import ROUTES from "@/constants/routes";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import { getDeviconClassName } from "@/lib/utils";
import Image from "next/image";
import imgClose from "./../../public/icons/close.svg"
interface Props {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handelRemove?: () => void;
}
const TagCards = ({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  isButton,
  handelRemove,
}: Props) => {
  const iconClass = getDeviconClassName(name);
  const handleClick =(e:React.MouseEvent)=>{e.preventDefault()}
  const Content = (
    <>
      {" "}
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase flex flex-row gap-2">
        <div className="flex-center space-x-2">
          <i className={`${iconClass} text-sm`}></i>
          <span>{name}</span>
        </div>{remove && <Image src={imgClose} alt="close tag" width={12} height={12} className="cursor-pointer object-contain invert-0 dark:invert " onClick={handelRemove}/>}
      </Badge>
      
      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}</p>
      )}
    </>
  );
  if (compact) {
    return isButton ? (
      <button onClick={handleClick} className="flex justify-between gap-2">{Content}</button>
    ) : (
      <Link href={ROUTES.TAGS(_id)} className="flex justify-between gap-2">
        {Content}
      </Link>
    );
  }
};

export default TagCards;
