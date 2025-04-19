import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "./../../../public/images/site-logo.svg";
import Theme from "./Theme";
import MobileNavigation from "./MobileNavigation";
import { auth } from "@/Auth";
import UserAvatar from "@/components/UserAvatar";
const NavBar = async() => {
  const session = await auth()
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full p-6 dark:shadow-none sm:px-12 shadow-light-300 gap-5">
      <Link href="/" className="flex items-center gap-1">
        <Image src={logo} width={23} height={23} alt="DevFlow Logo" />
        <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev<span className="text-primary-500">Flow</span>
        </p>
      </Link>
      <p>Global Search</p>
      <div className="flex-between gap-5 ">
        {" "}
        <Theme />
        {session?.user?.id&& (<UserAvatar
        id={session?.user?.id}
        name={session.user.name!}
        imageUrl={session?.user?.image}
        />)}
        <MobileNavigation />
      </div>
    </nav>
  );
};

export default NavBar;
