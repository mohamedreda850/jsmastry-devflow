import { DEFAULT_EMPTY, DEFAULT_ERROR } from "@/constants/states";
import Image, { StaticImageData } from "next/image";
import React from "react";
import darkIllustration from "./../public/images/dark-illustration.png";
import lightIllustration from "./../public/images/light-illustration.png";
import errordark from "./../public/images/dark-error.png";
import errorlight from "./../public/images/light-error.png";
import Link from "next/link";
import { Button } from "./ui/button";
interface Props<T> {
  success: boolean;
  error: {
    message: string;
    details?: Record<string, string[]>;
  };
  data: T[] | null | undefined;
  empty: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };
  render: (data: T[]) => React.ReactNode;
}
interface StateSkeletonProps {
  image: {
    light: StaticImageData;
    dark: StaticImageData;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}
const StateSkeleton = ({
  image,
  title,
  message,
  button,
}: StateSkeletonProps) => {
  return (
    <div className="mt-16 flex w-full flex-col items-center justify-center sm:mt-36">
      <>
        <Image
          src={image.dark}
          alt={image.alt}
          width={270}
          height={200}
          className="hidden object-contain dark:block"
        />
        <Image
          src={image.light}
          alt={image.alt}
          width={270}
          height={200}
          className="block object-contain dark:hidden"
        />
      </>
      <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
        {message}
      </p>
      {button && (
        <Link href={button.href}>
          <Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-3 text-light-900 hover:bg-primary-500">
            {button.text}
          </Button>
        </Link>
      )}
    </div>
  );
};
const DataRenderer = <T,>({
  success,
  error,
  data,
  empty = DEFAULT_EMPTY,
  render,
}: Props<T>) => {
  if (!success) {
    return (
      <StateSkeleton
        image={{
          light: errorlight,
          dark: errordark,
          alt: "Error state illustration",
        }}
        title={error?.message || DEFAULT_ERROR.title}
        message={
          error?.details
            ? JSON.stringify(error.details, null, 2)
            : DEFAULT_ERROR.message
        }
        button={empty.button}
      />
    );
  }
  if (!data || data.length === 0)
    return (
      <StateSkeleton
        image={{
          light: lightIllustration,
          dark: darkIllustration,
          alt: "Empty state illustration",
        }}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );
  return <div>{render(data)}</div>;
};

export default DataRenderer;
