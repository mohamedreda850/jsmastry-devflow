import { auth } from "@/Auth";
import ProfileLink from "@/components/user/ProfileLink";
import UserAvatar from "@/components/userAvatar";
import { getUser } from "@/lib/actions/user.action";
import { RouteParams } from "@/types/global";
import { notFound } from "next/navigation";
import linkIcon from "./../../../../public/icons/link.svg"
import locationIcon from "./../../../../public/icons/location.svg"
import calenderIcon from "./../../../../public/icons/calendar.svg"
import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const Profile = async ({params}: RouteParams) => {
  const {id} = await params;
  if(!id) return notFound();
  const logedinUser = await auth();


  const {success, data, error} = await getUser({
    userId: id,
  })

  if(!success) return <div className="h1-bold text-dark100_light900">{error?.message}</div>

  const {user, totalQuestions, totalAnswers} = data;
  const{_id, name, username, image, location, portfolio, reputation, createdAt, bio} = user;

  return <>
  <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
    <div className="flex flex-col items-center gap-4 lg:flex-row">
      <UserAvatar
      id={_id}
      name={name}
      imageUrl={image}
      className="size-[140px] rounded-[100%] object-cover"
      />
      <div className="mt-3">
        <h2 className="h2-bold text-dark100_light900">{name}</h2>
        <p className="paragraph-regular text-dark200_light800">@{username}</p>
        <div className="mt-5 flex-wrap items-center justify-start gap-5">
          {portfolio && (
            <ProfileLink
            imageUrl={linkIcon}
            href={portfolio}
            title="Portfolio"
            />
          )}
          {location && (
            <ProfileLink
            imageUrl={locationIcon}
            title="Location"
            />
          )}
          <ProfileLink
            imageUrl={calenderIcon}
            title={dayjs(createdAt).format("MMMM YYYY")}
            />
        </div>
        {bio && (
          <p className="paragraph-regular text-dark200_light800">{bio}</p>
        )}
      </div>
    </div>
    <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-4">
      {logedinUser?.user?.id &&(
        <Link href={"/profile/edit"}>
          <Button className="paragraph-medium btn-secondary min-h-12 min-w-44 text-dark300_light900 px-4 py-3">Edit Profile</Button>
        </Link>
      )}
    </div>
  </section>
  
  </>;
};

export default Profile;
