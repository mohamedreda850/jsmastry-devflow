import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Plesse provide a valid email adress." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." }),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" }),
  content: z.string().min(1, { message: "Content is required" }),

  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag must be at least 1 character long" })
        .max(30, { message: "Tag cannot exceed 30 characters." })
    )
    .min(1, { message: "At least one tag is required" })
    .max(3, { message: "Maximum 3 tags are allowed" }),
});

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z
    .string()
    .min(3, { message: "User Name must be at least 3 characters long." }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  bio: z.string().optional(),
  image: z
    .string()
    .url({ message: "Please provide a valid image url." })
    .optional(),
  location: z.string().optional(),
  portfolio: z
    .string()
    .url({ message: "Please provide a valid portfolio url." })
    .optional(),
  reputation: z.number().optional(),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, { message: "Provider is required." }),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
});

export const signinWithOAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required." }),
  user: z.object({
    name: z.string().min(1, { message: "Name is required." }),
    username: z
      .string()
      .min(3, { message: "Username must be at leas 3 characters long." }),
    email: z
      .string()
      .email({ message: "Please provide a valid email address" }),
    image: z.string().url("Inavlid image URl").optional(),
  }),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export const getQuestionSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export const PaginatedSearchPaamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const getTagQuestionSchema = PaginatedSearchPaamsSchema.extend({
  tagId: z.string().min(1, { message: "Tag ID is required." }),
});

export const incrementViewsSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

export const AnswerSchema = z.object({
  content: z
    .string()
    .min(50, { message: "Answer has to have more than 50 characters" }),
});

export const AnswerServerSchema = AnswerSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

export const GetAnswersSchema = PaginatedSearchPaamsSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

export const AIAnswerSchema = z.object({
  question: z
    .string()
    .min(5, { message: "Question is required." })
    .max(150, "Question cannot excees 150 characters."),
  content: z
    .string()
    .min(100, { message: "Answer has to have more than 50 characters." }),
  userAnswer: z.string().optional(),
});

export const CreateVoteSchema = z.object({
  targetId: z.string().min(1, { message: "Target ID is required." }),
  targetType: z.enum(["question", "answer"], {
    message: "Invalid target type",
  }),
  voteType: z.enum(["upvote", "downvote"], { message: "Invalid vote type" }),
});

export const UpdateVoteCountSchema = CreateVoteSchema.extend({
  change: z.number().int().min(-1).max(1),
});

export const HasVotedSchema = CreateVoteSchema.pick({
  targetId: true,
  targetType: true,
});

export const CollectionBaseSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

export const GetUserSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
});

export const GetUserQuestionsSchema = PaginatedSearchPaamsSchema.extend({
  userId: z.string().min(1, { message: "User ID is required." }),
});

export const GetUserAnswersSchema = PaginatedSearchPaamsSchema.extend({
  userId: z.string().min(1, { message: "User ID is required." }),
});

export const GetUserTagsSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
});

export const DeleteQuestionSchema = z.object({
  questionId: z.string().min(1, "Question ID is required."),
});

export const DeleteAnswerSchema = z.object({
  answerId: z.string().min(1, "Answer ID is required."),
});

export const CreateInteractionSchema = z.object({
  action: z.enum([
    "view",
    "upvote",
    "downvote",
    "bookmark",
    "post",
    "edit",
    "delete",
    "search",
  ]),
  actionTarget: z.enum(["question", "answer"]),
  actionId: z.string().min(1, "Action ID is required."),
  authorId: z.string().min(1, "Author ID is required."),
});

export const UpdateUserSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username cannot exceed 30 characters." }),

  email: z.string().email({ message: "Please provide a valid email address." }),
  bio: z
    .string()
    .max(500, { message: "Bio cannot exceed 500 characters." })
    .optional(),
  image: z
    .string()
    .url({ message: "Please provide a valid image URL." })
    .optional(),
  location: z
    .string()
    .max(100, { message: "Location cannot exceed 100 characters." })
    .optional(),
  portfolio: z.string().optional(),
});
