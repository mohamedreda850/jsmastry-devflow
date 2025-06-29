import { auth } from "@/Auth";
import ProfileLink from "@/components/user/ProfileLink";
import UserAvatar from "@/components/UserAvatar";
import {
  getUser,
  getUserAnswers,
  getUserQuestions,
  getUserStats,
  getUserTopTags,
} from "@/lib/actions/user.action";
import { RouteParams, Question, Answer } from "@/types/global";
import { notFound } from "next/navigation";
import linkIcon from "./../../../../public/icons/link.svg";
import locationIcon from "./../../../../public/icons/location.svg";
import calenderIcon from "./../../../../public/icons/calendar.svg";
import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Stats from "@/components/user/stats";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import DataRenderer from "@/components/DataRenderer";
import { EMBTY_ANSWERS, EMPTY_QUESTION } from "@/constants/states";
import QuestionCard from "@/components/cards/QuestionCard";
import Pagination from "@/components/Pagination";
import AnswerCard from "@/components/cards/AnswerCard";
import TagCards from "@/components/cards/TagCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile of a user",
};

const Profile = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page = 1, pageSize = 10 } = await searchParams;
  if (!id) return notFound();
  const logedinUser = await auth();

  const { success, data, error } = await getUser({
    userId: id,
  });

  if (!success)
    return (
      <div className="h1-bold text-dark100_light900">{error?.message}</div>
    );
  if (!data) return null;

  const { user } = data;
  const {
    success: userQuestionsSuccess,
    data: userQuestions,
    error: userQuestionsError,
  } = await getUserQuestions({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });
  const {
    success: userTopTagsSuccess,
    data: userTopTags,
    error: userTopTagsError,
  } = await getUserTopTags({
    userId: id,
  });

  const {
    success: userAnswersSuccess,
    data: userAnswers,
    error: userAnswersError,
  } = await getUserAnswers({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });
  const { questions, isNext: hasMoreQuestions } = userQuestions!;
  const { answers, isNext: hasMoreAnswers } = userAnswers!;
  const { tags } = userTopTags!;

  // Type assertions to fix TypeScript errors
  const typedQuestions = questions as Question[];
  const typedAnswers = answers as Answer[];
  const typedTags = tags as { _id: string; name: string; count: number }[];

  const { data: userStats } = await getUserStats({ userId: id });
  const {
    _id,
    name,
    username,
    image,
    location,
    portfolio,
    reputation,
    createdAt,
    bio,
  } = user;

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={_id}
            name={name}
            imageUrl={image}
            className="size-[140px] rounded-[100%] object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{username}
            </p>
            <div className="mt-5 flex-wrap items-center justify-center gap-5">
              {portfolio && (
                <ProfileLink
                  imageUrl={linkIcon}
                  href={portfolio}
                  title="Portfolio"
                />
              )}
              {location && (
                <ProfileLink imageUrl={locationIcon} title={location} />
              )}
              <ProfileLink
                imageUrl={calenderIcon}
                title={dayjs(createdAt).format("MMMM YYYY")}
              />
            </div>
            {bio && (
              <p className="paragraph-regular text-dark200_light800">{bio}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-4">
          {logedinUser?.user?.id && (
            <Link href={"/profile/edit"}>
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-12 min-w-44 px-4 py-3">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>
      <Stats
        totalQuestions={userStats?.totalQuestions || 0}
        totalAnswers={userStats?.totalAnswers || 0}
        reputationPoints={reputation || 0}
        badges={
          userStats?.badges || {
            GOLD: 0,
            SILVER: 0,
            BRONZE: 0,
          }
        }
      />
      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-[2]">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <DataRenderer
              data={typedQuestions}
              empty={EMPTY_QUESTION}
              success={userQuestionsSuccess}
              error={
                userQuestionsError || { message: "An unknown error occurred" }
              }
              render={(questions) => (
                <div className="flex w-full flex-col gap-6">
                  {questions.map((question) => (
                    <QuestionCard
                      showActionBtns={
                        logedinUser?.user?.id === question?.author?._id
                      }
                      key={question._id}
                      question={question}
                    />
                  ))}
                </div>
              )}
            />
            <Pagination page={Number(page) || 1} isNext={hasMoreQuestions} />
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            <DataRenderer
              data={typedAnswers}
              empty={EMBTY_ANSWERS}
              success={userAnswersSuccess}
              error={
                userAnswersError || { message: "An unknown error occurred" }
              }
              render={(answers) => (
                <div className="flex w-full flex-col gap-10">
                  {answers.map((answer) => (
                    <AnswerCard
                      key={answer._id}
                      {...answer}
                      content={answer.content.slice(0, 30)}
                      containerClasses="card-wrapper rounded-[10px] px-7 py-9 sm:px-11"
                      showReadMore={true}
                      showActionBtns={
                        logedinUser?.user?.id === answer?.author?._id
                      }
                    />
                  ))}
                </div>
              )}
            />
            <Pagination page={Number(page) || 1} isNext={hasMoreAnswers} />
          </TabsContent>
        </Tabs>
        <div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
          <h3 className="h3-bold text-dark200_light900">Top Tech</h3>
          <div className="mt-7 flex flex-col gap-4">
            <DataRenderer
              data={typedTags}
              empty={EMBTY_ANSWERS}
              success={userTopTagsSuccess}
              error={
                userTopTagsError || { message: "An unknown error occurred" }
              }
              render={(tags) => (
                <div className="mt-3 flex w-full flex-col gap-4">
                  {tags.map((tag) => (
                    <TagCards
                      key={tag._id}
                      _id={tag._id}
                      name={tag.name}
                      questions={tag.count}
                      showCount
                      compact
                    />
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
