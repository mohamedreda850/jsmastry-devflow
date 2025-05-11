import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { getTags } from "@/lib/actions/tag.action";
import { RouteParams } from "@/types/global";
import React from "react";
import searchImage from "./../../../public/icons/search.svg";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_TAGS } from "@/constants/states";
import TagCards from "@/components/cards/TagCard";
const Tags = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });
  const { tags } = data || {};
  console.log(tags, JSON.stringify(tags, null, 1));

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAGS}
          imgSrc={searchImage}
          placeHolder="Search Tags..."
          iconPosition="left"
          otherClasses="flex-1"
        />
        <DataRenderer
          success={success}
          error={error || { message: "An unknown error occurred." }}
          data={tags}
          empty={EMPTY_TAGS}
          render={(tags) => (
            <div className="mt-10 flex w-full flex-wrap gap-4">
              {tags.map((tag) => (
                <TagCards key={tag._id} {...tag} />
              ))}
            </div>
          )}
        />
      </section>
    </>
  );
};

export default Tags;
