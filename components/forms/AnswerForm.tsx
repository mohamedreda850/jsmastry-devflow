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
import { useRef, useState } from "react";
import { AnswerSchema } from "@/lib/vaildations";
import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { Loader2 } from "lucide-react";
import Image from "next/image";
const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

const AnswerForm = () => {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isAISubmiting, setIsAISubmiting] = useState(false);

  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    console.log(values);
  };
  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">Write your answer here</h4>
        <Button className="btn light-border-2 gap-1.5 rounded-md border px-2.5 text-primary-500 shadow-none dark:text-primary-500" disabled={isAISubmiting}>
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
                    editorRef={editorRef}
                    fieldChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" className="primary-gradient w-fit">
              {isSubmiting ? (
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
