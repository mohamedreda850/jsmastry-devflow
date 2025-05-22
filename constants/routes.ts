const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  ASK_QUESTION: "/ask-question",
  COLLECTION: "/collection",
  COMMUNITY: "/community",
  TAGS: "/tags",
  JOBS: "/jobs",
  QUESTION: (id: string) => `/questions/${id}`,
  PROFILE: (id: string) => `profile/${id}`,
  TAG: (id: string) => `tags/${id}`,
  
};

export default ROUTES;
