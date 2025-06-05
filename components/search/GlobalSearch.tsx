"use client";

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { globalSearch } from "@/actions/search";

const GlobalSearch = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Array<{
    title: string;
    type: string;
    id: string;
  }>>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery) {
        setIsLoading(true);
        try {
          const searchResults = await globalSearch({ query: searchQuery });
          setResults(searchResults);
        } catch (error) {
          console.error("Error searching:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleClick = (result: { type: string; id: string }) => {
    switch (result.type) {
      case "question":
        router.push(`/questions/${result.id}`);
        break;
      case "user":
        router.push(`/profile/${result.id}`);
        break;
      case "answer":
        router.push(`/questions/${result.id}`);
        break;
      case "tag":
        router.push(`/tags/${result.id}`);
        break;
      default:
        break;
    }
    setSearchQuery("");
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-[600px] ">
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-[16px] px-4">
        <Image
          src="/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search globally"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
        />
      </div>
      {searchQuery && (
        <div className="rounded-xl absolute top-full mt-3 w-full bg-light-800 p-4 shadow-sm dark:bg-dark-400">
          {isLoading ? (
            <div className="flex-center w-full">Loading...</div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="flex cursor-pointer items-start gap-3 p-2 hover:bg-light-700 dark:hover:bg-dark-300"
                  onClick={() => handleClick(result)}
                >
                  <p className="body-medium text-dark200_light800 line-clamp-1">
                    {result.title}
                  </p>
                  <span className="small-medium text-light400_light500 mt-1">
                    {result.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-center w-full">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch; 