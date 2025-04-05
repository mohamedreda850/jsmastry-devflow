"use client";

import { AskQuestionSchema } from "@/lib/vaildations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const QuestionForm = () => {
  const form = useForm({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });
  const handleCreateQuestion = () => {};
  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-col flex w-full">
              <FormLabel className="paragraph-semibold text-dark400_light700">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 no-focus min-h-[56px] border"
                />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Be specific and imagine you are asking a question to another
                person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-col flex w-full">
              <FormLabel className="paragraph-semibold text-dark400_light700">
                Detailed explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>editor</FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Introduce the problem and expand on what you put in the title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex-col flex w-full gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light700">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    placeholder="Add tags..."
                    {...field}
                    className="paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 no-focus min-h-[56px] border"
                  />
                  Tags
                </div>
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                add up to 3 tags to describe what your question is about. you
                need to press enter to add a tag.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-16 flex justify-end">
            <Button type="submit" className="primary-gradient !text-light-900 w-fit">
                Ask A Question
            </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
