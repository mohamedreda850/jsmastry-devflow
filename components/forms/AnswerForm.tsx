"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import starsImage from "./../../public/icons/stars.svg";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRef, useState, useTransition } from "react";
import { AnswerSchema } from "@/lib/vaildations";
import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";
const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});
interface Props {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}
const AnswerForm = ({ questionId, questionTitle, questionContent }: Props) => {
  const [isAnswering, startAnsweringTransition] = useTransition();
  const [isAISubmiting, setIsAISubmiting] = useState(false);

  const session = useSession();

  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransition(async () => {
      const result = await createAnswer({
        questionId,
        content: values.content,
      });
      if (result.success) {
        form.reset();
        toast({
          title: "Success",
          description: "Your answer has been posted successfully",
        });
        if (editorRef.current) {
          editorRef.current.setMarkdown("");
        }
      } else {
        toast({
          title: "Error",
          description: result?.error?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  };

  const generateAIAnswer = async () => {
    console.log("Starting AI answer generation...");
    if (session.status !== "authenticated") {
      console.log("User not authenticated");
      return toast({
        title: "Error",
        description: "You must be logged in to generate an AI answer",
      });
    }
    setIsAISubmiting(true);
const userAnswer = editorRef?.current?.getMarkdown();

    try {
      const { success, data, error } = await api.ai.getAnswer(
        questionTitle,
        questionContent,
        userAnswer,
      );

      if (!success) {
        toast({
          title: "Error",
          description: error?.message || "Something went wrong",
          variant: "destructive",
        });
        return;
      }

      const formatedAnswer = (data as string)
        .replace(/<br>/g, " ")
        .toString()
        .trim();

      if (editorRef.current) {
        console.log("Formatted answer:", formatedAnswer);
        editorRef.current.setMarkdown(formatedAnswer);
        form.setValue("content", formatedAnswer);
        form.trigger("content");
      }

      toast({
        title: "Success",
        description: "AI answer generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsAISubmiting(false);
    }
  };
  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="btn light-border-2 gap-1.5 rounded-md border px-2.5 text-primary-500 shadow-none dark:text-primary-500"
          disabled={isAISubmiting}
          onClick={generateAIAnswer}
        >
          {isAISubmiting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-ping" /> Generating...
            </>
          ) : (
            <>
              <Image
                src={starsImage}
                alt="Generate AI answer"
                width={12}
                height={12}
                className="object-contain"
              />{" "}
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 ">
                <FormControl>
                  <Editor
                    value={field.value}
                    ref={editorRef}
                    fieldChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" className="primary-gradient w-fit">
              {isAnswering ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-ping" /> Posting...
                </>
              ) : (
                "Post Answer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
