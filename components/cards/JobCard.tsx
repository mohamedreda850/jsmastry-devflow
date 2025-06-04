"use client";
import Image from "next/image";
import image1 from "./../../public/images/auth-light.png";
import React, { useEffect, useState } from "react";
import darkEmptyImage from "./../../public/images/DarkEmptyProfile.png";
import lightEmptyImage from "./../../public/images/LightEmptyProfile.png";
import { useTheme } from "next-themes";
import clockIcon from "./../../public/icons/clock-2.svg";
import currencyIcon from "./../../public/icons/currency-dollar-circle.svg";
import arrowUpRight from "./../../public/icons/arrow-up-right.svg";

import { Avatar } from "../ui/avatar";

interface Props {
  job: {
    _id: string;
    imgUrl?: string;
    company: string;
    title: string;
    location: string;
    description: string;
    jobType: string;
    type?: string;
    salary?: string;
    url?: string;
  };
}
export default function JobCard({ job }: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? resolvedTheme : 'light';
  
  return (
    <div className="card-wrapper flex w-full gap-5 rounded-[10px] p-9 sm:px-11">
      <div className="shrink-0">
        <Image
          src={job.imgUrl || (currentTheme === "dark" ? darkEmptyImage : lightEmptyImage)}
          alt={job.company}
          width={64}
          height={64}
          className="rounded-lg"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:flex-row">
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {job.title}
            </h3>
            <div className="background-light800_dark400 rounded-1.5 px-4 py-1">
              <h4 className="paragraph-regular text-dark500_light500">
                {job.jobType}
              </h4>
            </div>
          </div>

          <span className="text-dark400_light700 small-medium background-light800_dark400 hidden items-center gap-2 rounded-full px-2 py-1 md:flex">
            <Avatar className="size-4">
              <Image src={image1} alt={job.company} width={18} height={18} />
            </Avatar>
            {job.location}
          </span>
        </div>
        <p className="small-regular text-dark500_light700 mt-2 line-clamp-3 break-words">
          {job.description.length > 100 ? `${job.description.substring(0, 100)}...` : job.description}
        </p>
        <div className="mt-2 flex justify-between gap-4">
          <div className="flex gap-5">
            <p className="body-regular text-dark500_light500 mt-2 flex items-center gap-1">
              <Image src={clockIcon} alt="clock" width={16} height={16} />
              {job.type}
            </p>
            {job.salary && (
            <p className="body-regular text-dark500_light500 mt-2 hidden items-center gap-1 md:flex">
              <Image src={currencyIcon} alt="currency" width={16} height={16} />
              {job.salary}
            </p>
            )}
          </div>
        <a
          href={job.url}
          className="mt-2 flex items-center gap-1 text-primary-500 cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
        >
          View job
          <Image src={arrowUpRight} alt="arrow-up-right" width={20} height={20} />
        </a>
        </div>
      </div>
    </div>
  );
}
