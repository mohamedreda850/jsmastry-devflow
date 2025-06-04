"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import editIcon from "./../../public/icons/edit.svg";
import trashIcon from "./../../public/icons/trash.svg";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { deleteQuestion } from "@/lib/actions/question.action";
import { deleteAnswer } from "@/lib/actions/answer.action";

interface Props {
  type: string;
  itemId: string;
}
const EditDeleteAction = ({ type, itemId }: Props) => {
  const router = useRouter();
  const handleEdit = async () => {
    if (type === "question") {
      router.push(`/questions/${itemId}/edit`);
    }
  };
  const handleDelete = async () => {
    if (type === "question") {
      await deleteQuestion({ questionId: itemId });
      toast({
        title: "Question deleted",
        description: "Your question has been deleted successfully",
      });
    } else if (type === "answer") {
      await deleteAnswer({ answerId: itemId });
      toast({
        title: "Answer deleted",
        description: "Your answer has been deleted successfully",
      });
    }
  };
  return (
    <div
      className={`flex items-center justify-end gap-3 max-sm:w-full ${type === "answer" && "gap-0 justify-center"}`}
    >
      {type === "question" && (
        <Image
          src={editIcon}
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer">
          <Image
            src={trashIcon}
            alt="delete"
            width={14}
            height={14}
            className="cursor-pointer object-contain"
          />
        </AlertDialogTrigger>
        <AlertDialogContent className="background-light800_dark300 border-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              {type === "question" ? "question" : "answer"} and remove it from
              our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!border-primary-100 !bg-primary-500 !text-light-800"
              onClick={handleDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditDeleteAction;
