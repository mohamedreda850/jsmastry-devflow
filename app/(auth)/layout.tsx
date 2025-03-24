import Image from "next/image";
import React, { ReactNode } from "react";
import logo from "./../../public/images/site-logo.svg";
import SocialAuthForm from "@/components/forms/SocialAuthForm";
const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex min-h-screen  items-center justify-center bg-auth-light dark:bg-auth-dark bg-center bg-cover bg-no-repeat px-4 py-9">
      <section className="light-border background-light800_dark200 shadow-light100_dark100 min-w-full rounded-[10px] border py-10 shadow-md xs:min-w-[520px] xs:px-8">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-2.5">
            <h1 className="h2-bold text-dark100_light900">Join DevFlow</h1>
            <p className="paragraph-regular text-dark500_light400">
              To get your question answered
            </p>
          </div>
          <Image
            src={logo}
            alt="DevFlow Logo"
            width={50}
            height={50}
            className="object-contain"
          />
        </div>
        {children}
        <SocialAuthForm />
      </section>
    </main>
  );
};

export default AuthLayout;
