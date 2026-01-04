"use client";

// import { useTranslations } from "next-intl";
import { BaseSignupForm } from "../../_views/signup-form";

const VendorSignupPage = () => {
  // const tAuth = useTranslations("auth");
  return (
    <section className="hide-scrollbar mx-auto flex h-full flex-col items-center justify-center overflow-y-auto lg:max-w-[550px]">
      <div className="mb-6 space-y-2 text-center sm:mt-8">
        <h3 className="!text-primary !text-2xl sm:!text-2xl lg:!text-3xl">{`Become A Skishop Seller`}</h3>
        <p className="text-[14px] lg:text-[18px]">{`Create an account to get started as a vendor, and start selling your products on Skishop.`}</p>
      </div>
      <BaseSignupForm />
    </section>
  );
};
export default VendorSignupPage;
