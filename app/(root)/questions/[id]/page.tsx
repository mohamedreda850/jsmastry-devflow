import Metric from "@/components/Metric";
import UserAvatar from "@/components/userAvatar";
import ROUTES from "@/constants/routes";
import { RouteParams, Tag } from "@/types/global";
import Link from "next/link";
import clockImage from "./../../../../public/icons/clock.svg";
import messageImage from "./../../../../public/icons/message.svg";
import eyeImage from "./../../../../public/icons/eye.svg";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import TagCards from "@/components/cards/TagCard";
import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { redirect } from "next/navigation";
import AnswerForm from "@/components/forms/AnswerForm";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};
const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [_, { success, data: question }] = await Promise.all([
    await incrementViews({ questionId: id }),
    await getQuestion({ questionId: id }),
  ]);

  if (!success || !question) return redirect("/404");
  const { author, createdAt, answers, view, tags, title, content } = question;
  const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start ">
            <UserAvatar
              id={author._id}
              name={author.name}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>
          <div className="flex justify-end">
            <p>Votes</p>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl={clockImage}
          alt="Clock icon"
          value={` asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark_light700"
        />
        <Metric
          imgUrl={messageImage}
          alt="Clock icon"
          value={answers}
          title=""
          textStyles="small-regular text-dark_light700"
        />
        <Metric
          imgUrl={eyeImage}
          alt="Clock icon"
          value={formatNumber(view)}
          title=""
          textStyles="small-regular text-dark_light700"
        />
      </div>
      <section className="markdown prose grid break-words">
        <MDXRemote
          source={formattedContent}
          components={{
            pre: (props) => (
              <Code
                {...props}
                lineNumbers
                className="shadow-light-200 dark:shadow-dark-200"
              />
            ),
          }}
        />
      </section>
      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCards key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>
      <section className="mt-5">
        <AnswerForm questionId={question._id}/>
      </section>
    </>
  );
};

export default QuestionDetails;
