import { auth } from "@/Auth";
import QuestionForm from "@/components/forms/QuestionForm";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
export const metadata: Metadata = {
  title: "Ask a question",
  description: "Ask a question to the community",
};
const AskAQuestion = async () => {
  const session = await auth();
  if (!session) return redirect("/sign-in");
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div className="mt-9 ">
        <QuestionForm />
      </div>
    </>
  );
};

export default AskAQuestion;
