interface signinWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    email: string;
    name: string;
    image: string;
    username: string;
  };
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface CreatQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends CreatQuestionParams {
  questionId: string;

}

interface GetQuestionParams{
  questionId: string;
}