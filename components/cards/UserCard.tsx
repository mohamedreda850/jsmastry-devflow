import { User } from "@/types/global";
import UserAvatar from "../userAvatar";
import Link from "next/link";
import ROUTES from "@/constants/routes";

const UserCard = ({ _id, name, image, username }: User) => (
  <div className="shadow-light100_darknone w-full xs:w-[230px]">
    <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-[1rem] border p-8">
      <UserAvatar
        id={_id}
        name={name}
        imageUrl={image}
        className="size-[100px] rounded-[100%] object-cover"
        fallbackClassName="text-3xl tracking-tighter"
      />
      <Link href={ROUTES.PROFILE(_id)}>
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">{name}</h3>
          <p className="body-regular text-dark500_light500 mt-2">@{username}</p>
        </div>
      </Link>
    </article>
  </div>
);

export default UserCard;
