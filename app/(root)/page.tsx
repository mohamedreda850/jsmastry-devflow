import { auth } from "@/Auth";

import { log } from "console";

const Home = async () => {
  const session = await auth();
  log(session);
  return (
    <>
      <h1 className="h1-bold ">Welcome to the world of Next.js</h1>
    </>
  );
};
export default Home;
