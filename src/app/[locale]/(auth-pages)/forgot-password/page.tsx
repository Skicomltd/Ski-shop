"use client";

// import { BackButton } from "@/components/shared/back-button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { ForgotPasswordForm } from "../_views/forgot-password-form";

const Page = () => {
  const router = useRouter();
  const tAuth = useTranslations("auth");
  return (
    <section>
      <div onClick={() => router.back()} className={`text-primary mb-4 flex cursor-pointer gap-2 font-medium`}>
        {/* <BackButton /> */}
        {/* <p>{tAuth("back") || tAuth("login")}</p> */}
      </div>
      <div className="mb-[22px] space-y-[5px] text-center lg:text-left">
        <h3 className="!text-[20px] lg:!text-[28px]">{tAuth("forgotPassword")}</h3>
        <p className="!text-[12px] lg:!text-[14px]">{`Enter your email address and we'll send you a link to reset your password`}</p>
      </div>
      <ForgotPasswordForm />
    </section>
  );
};
export default Page;
