"use client";

import { useEffect } from "react";
import { incrementViews } from "@/lib/actions/question.action";

const View = ({ questionId }: { questionId: string }) => {
  useEffect(() => {
    const incrementView = async () => {
      try {
        await incrementViews({ questionId });
      } catch (error) {
        console.error("Error incrementing view:", error);
      }
    };

    incrementView();
  }, [questionId]);

  return null;
};

export default View;
