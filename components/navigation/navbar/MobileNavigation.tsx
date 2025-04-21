import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import logo from "./../../../public/images/site-logo.svg";
import hamborger from "./../../../public/icons/hamburger.svg";
import Image from "next/image";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { Button } from "@/components/ui/button";
import NavLinks from "./NavLinks";
import { auth, signOut } from "@/Auth";
import { LogOut } from "lucide-react";
const MobileNavigation = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src={hamborger}
          width={36}
          height={36}
          alt="Menue"
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent side="left" className="background-light900_dark200">
        <SheetHeader>
          <SheetTitle className="hidden">Navigation</SheetTitle>
          <Link href="/" className="flex items-center gap-1">
            <Image src={logo} width={32} height={32} alt="log"></Image>
            <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900">
              Dev<span className="text-primary-500">Flow</span>
            </p>
          </Link>
          <div className="no-scrollbar flex h-[calc(100vh-180px)] flex-col items-start justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-6 pt-10 w-full">
                <NavLinks isMobileNav />
              </section>
            </SheetClose>
          </div>
          <div className="flex flex-col gap-2 ">
            {userId ? (
              <SheetClose asChild>
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <Button className="base-medium w-fit !bg-transparent px-4 py-3">
                    <LogOut className="size-5 text-black dark:text-white" />
                    <span className="text-dark300_light900">Logout</span>
                  </Button>
                </form>
              </SheetClose>
            ) : (
              <>
                <SheetClose asChild>
                  <Link href={ROUTES.SIGN_IN}>
                    <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                      <span className="primary-text-gradient">Log In</span>
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href={ROUTES.SIGN_UP}>
                    <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
                      Sign Up
                    </Button>
                  </Link>
                </SheetClose>
              </>
            )}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
