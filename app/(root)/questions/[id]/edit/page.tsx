import { auth } from "@/Auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";
import { RouteParams } from "@/types/global";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import React from "react";
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
  };
}

const EditQuestion = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();
  const session = await auth();
  if (!session) return redirect("/sign-in");

  const { data: question, success } = await getQuestion({ questionId: id });
  if (!success) return notFound();

  if (question?.author?._id?.toString() !== session?.user?.id) {
    return redirect(ROUTES.QUESTION(id));
  }

  return (
    <main>
      <QuestionForm question={question} isEdit />
    </main>
  );
};

export default EditQuestion;
