"use client";

import { PageSection } from "@/lib/animation";

// import { useTranslations } from "next-intl";

import { BaseSignupForm } from "../_views/signup-form";

const SignupPage = () => {
  // const tAuth = useTranslations("auth");
  return (
    <main className="hide-scrollbar mx-auto flex w-full flex-col items-center justify-center overflow-y-auto">
      <div className="mb-6 space-y-2 text-center sm:mt-8">
        <h3 className="!text-primary dark:!text-accent !text-2xl sm:!text-2xl lg:!text-3xl">{`Sign Up`}</h3>
        <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">{`Create an account to get started`}</p>
      </div>
      <PageSection index={1} className={`w-full`}>
        <BaseSignupForm />
      </PageSection>
    </main>
  );
};
export default SignupPage;
``;
