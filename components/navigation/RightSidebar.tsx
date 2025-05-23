import ROUTES from "@/constants/routes";
import Link from "next/link";
import icon from "./../../public/icons/chevron-right.svg";
import Image from "next/image";
import TagCards from "../cards/TagCard";
import { getHotQuestions } from "@/lib/actions/question.action";
import DataRenderer from "../DataRenderer";
import { getTopTags } from "@/lib/actions/tag.action";


const RightSidebar = async () => {
  const {success, data: hotQuestions, error} = await getHotQuestions()
  const {success:tagSuccsess, data:tags, error:errorTags} = await getTopTags()
  return (
    <section className="pt-36 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden  ">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
         <DataRenderer
         data={hotQuestions}
         empty={{
          title:"No questions found",
          message:"Be the first to break the silence",
         }}
         success={success}
         error={error || {message:"An unknown error occurred"}}
         render={(hotQuestions)=>(
          <div className="mt-7 flex w-full flex-col gap-[30px]">
            {hotQuestions.map(({_id, title})=>(
              <Link
              href={ROUTES.QUESTION(_id)}
              className="flex cursor-pointer items-center justify-between gap-6"
              key={_id}
            >
              <p className="body-medium text-dark500_light700 line-clamp-2">{title}</p>
              <Image
                src={icon}
                alt="chevron-right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
            ))}
          </div>
         )}

         />
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900 ">Popular Tags</h3>
        <DataRenderer
         data={tags}
         empty={{
          title:"No tag found",
          message:"Be the first to break the silence",
         }}
         success={tagSuccsess}
         error={errorTags || {message:"An unknown error occurred"}}
         render={(tags)=>(
          <div className="mt-7 flex flex-col gap-4">
          {tags.map(({ _id, name, questions }) => (
            <TagCards
              key={_id}
              _id={_id}
              name={name}
              questions={questions}
              showCount
              compact
            />
          ))}
        </div>
         )}

         />
        
      </div>
    </section>
  );
};

export default RightSidebar;
