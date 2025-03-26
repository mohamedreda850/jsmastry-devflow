"use client";

import AuthForm from "@/components/forms/AuthForm";
import { SignInSchema } from "@/lib/vaildations";
import React from "react";

const SignIn = () => {
  return (
    <AuthForm
      formType="SIGN-IN"
      schema={SignInSchema}
      defaultValues={{ email: "", password: "" }}
      onSubmit={(data) =>
        Promise.resolve({
          success: true,
          data,
        })
      }
    />
  );
};

export default SignIn;
