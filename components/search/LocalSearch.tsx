"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/url";

interface Props {
  route: string;
  imgSrc: string;
  placeHolder: string;
  otherClasses?: string;
  iconPosition?: "left" | "right";
}
const LocalSearch = ({
  route,
  imgSrc,
  placeHolder,
  otherClasses,
  iconPosition = "left",
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const serachParams = useSearchParams();
  const query = serachParams.get("query");
  const [searchQuery, setSearchQuery] = useState(query) || "";
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        const url = formUrlQuery({
          params: serachParams.toString(),
          key: "query",
          value: searchQuery,
        });
        router.push(url, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: serachParams.toString(),
            keyToRemove: ["query"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, pathname, router, serachParams, route]);
  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}

      <Input
        type="text"
        placeholder={placeHolder}
        value={searchQuery || ""}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
      />
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search"
          width={15}
          height={215}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearch;
