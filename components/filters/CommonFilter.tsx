"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "@/lib/utils";
import { formUrlQuery } from "@/lib/url";


interface Filter {
  name: string;
  value: string;
}
interface Props {
  filters: Filter[];
  containerClasses?: string;
  otherClasses?: string;
}

const CommonFilter = ({
  filters,
  containerClasses = "",
  otherClasses = "",
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paramsFilter = searchParams.get("filter");

  const handleUpdateParams = (value: string) => {
    const newURL = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value,
    });
    router.push(newURL, {scroll: false})
   
  };
  return (
    <div className={cn("relative", containerClasses)}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramsFilter || undefined}
      >
        <SelectTrigger
          className={cn(
            `body-regulae no-focus light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`,
            otherClasses,
          )}
          aria-label="Filter options"
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                {filters.map((item)=>(
                    <SelectItem key={item.value} value={item.value}>
                        {item.name}
                    </SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CommonFilter;
