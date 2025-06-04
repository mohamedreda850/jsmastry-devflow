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
import { getAnswers } from "@/lib/actions/answer.action";
import AllAnswers from "@/components/answers/AllAnswers";
import Votes from "@/components/votes/votes";
import { hasVoted } from "@/lib/actions/vote.action";
import { Suspense } from "react";
import SaveQuestion from "@/components/questions/SaveQuestion";
import { hasSavedAction } from "@/lib/actions/collection.action";
import { Metadata } from "next";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};
export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;
  const { success, data: question } = await getQuestion({ questionId: id });
  if (!success || !question)
    return {
      title: "Question not found",
      description: "The question you are looking for does not exist.",
    };
  return {
    title: question.title,
    description: question.content.slice(0, 100),
    twitter: {
      card: "summary_large_image",
      title: question.title,
      description: question.content.slice(0, 100),
    },
  };
}
const QuestionDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [_, { success, data: question }] = await Promise.all([
    await incrementViews({ questionId: id }),
    await getQuestion({ questionId: id }),
  ]);
  const { page, pageSize, filter } = await searchParams;
  if (!success || !question) return redirect("/404");

  const {
    success: araAnswersLoaded,
    data: answersResults,
    error: answersError,
  } = await getAnswers({
    questionId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter,
  });

  const hasVotedPromise = hasVoted({
    targetId: question._id,
    targetType: "question",
  });
  const hasSavedQuestionPomise = hasSavedAction({ questionId: question._id });
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
              imageUrl={author.image}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>
          <div className="flex justify-end items-center gap-4">
            <Suspense fallback={<div>Loading...</div>}>
              <Votes
                upvotes={question.upvotes}
                targetType="question"
                targetId={question._id}
                downvotes={question.downvotes}
                hasVotedPromise={hasVotedPromise}
              />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
              <SaveQuestion
                questionId={question._id}
                hasSavedQuestionPomise={hasSavedQuestionPomise}
              />
            </Suspense>
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
      <section className="my-5">
        <AllAnswers
          page={Number(page) || 1}
          isNext={answersResults?.isNext || false}
          data={answersResults?.answers}
          success={araAnswersLoaded}
          error={answersError}
          totalAnswers={answersResults?.totalAnswers || 0}
        />
      </section>
      <section className="mt-5">
        <AnswerForm
          questionId={question._id}
          questionTitle={question.title}
          questionContent={question.content}
        />
      </section>
    </>
  );
};

export default QuestionDetails;
