import LocalSearch from "@/components/search/LocalSearch";
import searchImage from "./../../../public/icons/search.svg";
import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_SAVED_QUESTIONS } from "@/constants/states";
import { getSavedQuestions } from "@/lib/actions/collection.action";
import ROUTES from "@/constants/routes";
import CommonFilter from "@/components/filters/CommonFilter";
import { CollectionFilters } from "@/constants/filters";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Collections = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });
  const { collections } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.COLLECTION}
          imgSrc={searchImage}
          placeHolder="Search questions..."
          otherClasses="flex-1"
        />
        <CommonFilter filters={CollectionFilters} otherClasses="min-h-[56px] sm:min-w-[170px]" />
      </div>

      <DataRenderer
        success={success}
        error={error || { message: "An unknown error occurred." }}
        data={collections}
        empty={EMPTY_SAVED_QUESTIONS}
        render={(collections) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {collections.map((item) => (
              <QuestionCard key={item._id} question={item.question} />
            ))}
          </div>
        )}
      />
    </>
  );
};
export default Collections;
