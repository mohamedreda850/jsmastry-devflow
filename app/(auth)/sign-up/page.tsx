"use client";

import AuthForm from "@/components/forms/AuthForm";
import { SignUpSchema } from "@/lib/vaildations";

const SignUp = () => {
  return (
    <AuthForm
      formType="SIGN-UP"
      schema={SignUpSchema}
      defaultValues={{ email: "", password: "", name: "", username: "" }}
      onSubmit={(data) =>
        Promise.resolve({
          success: true,
          data,
        })
      }
    />
  );
};

export default SignUp;
