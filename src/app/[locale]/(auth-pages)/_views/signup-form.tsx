/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SkiButton from "@/components/shared/button";
import { FormField, PasswordValidation } from "@/components/shared/inputs/FormFields";
import { LocaleLink } from "@/components/shared/locale-link";
import { createRegisterSchema, RegisterFormData } from "@/schemas/auth-schemas";
import { useAuthService } from "@/services/auth/use-auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
// import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

export const BaseSignupForm = () => {
  // const [isGooglePending, startGoogleTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const tAuth = useTranslations("auth");
  const { useSignUp } = useAuthService();
  const { mutateAsync: signUp, isPending: isSigningUp } = useSignUp();

  const [formError, setFormError] = useState<string | null>(null);

  // Determine role based on pathname
  const role = pathname.includes("/vendor") ? "vendor" : "customer";

  // Create schema with translations
  const registerSchema = createRegisterSchema((key: string) => {
    const keys = key.split(".");
    if (keys[0] === "auth") {
      return tAuth(keys[1]);
    }
    return key;
  });

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: role,
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
    watch,
  } = methods;

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const handleSubmitForm = async (data: RegisterFormData) => {
    setFormError(null);

    await signUp(data, {
      onSuccess: (response) => {
        if (response?.success && !pathname.includes("/vendor")) {
          toast.success(tAuth("signupSuccess"), {
            // description: tAuth("signupSuccess"),
          });
          router.push(`/${locale}/onboarding/verify-email?email=${data?.email}&token=${response?.data?.token}`);
        } else if (response?.success && pathname.includes("/vendor")) {
          toast.success(tAuth("signupSuccess"), {
            // description: tAuth("passwordResetSent"),
          });
          router.push(`/${locale}/onboarding/vendor/verify-email?email=${data?.email}&token=${response?.data?.token}`);
        }
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          tAuth("signupFailed") ||
          "Signup failed. Please try again.";
        setFormError(errorMessage);
        toast.error(tAuth("signupFailed"), { description: errorMessage });
      },
    });
  };

  // const handleGoogleSignIn = () => {
  //   startGoogleTransition(async () => {
  //     router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/oauth/google/redirect`);
  //   });
  // };

  const renderFormFields = () => (
    <section className="space-y-4 sm:space-y-5">
      <FormField placeholder={tAuth("email")} className="h-12 w-full sm:h-14" name="email" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField placeholder={tAuth("firstName")} className="h-12 w-full sm:h-14" name="firstName" />
        <FormField placeholder={tAuth("lastName")} className="h-12 w-full sm:h-14" name="lastName" />
      </div>
      <div>
        <FormField type="password" placeholder={tAuth("password")} className="h-12 w-full sm:h-14" name="password" />
        {password && <PasswordValidation password={password} />}
      </div>
      <div>
        <FormField
          type="password"
          placeholder={tAuth("confirmPassword")}
          className="h-12 w-full sm:h-14"
          name="confirmPassword"
        />
        {confirmPassword && (
          <div className="mt-2">
            {password === confirmPassword ? (
              <p className="flex items-center gap-1 text-[11px] !text-green-600">
                <span className="inline-block h-4 w-4 rounded-full bg-green-600 text-center leading-4 text-white">
                  ✓
                </span>
                Passwords match
              </p>
            ) : (
              <p className="!text-destructive flex items-center gap-1 text-[11px]">
                <span className="bg-destructive inline-block size-4 rounded-full text-center leading-4 text-white">
                  ✗
                </span>
                Passwords do not match
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );

  const renderTermsSection = () => (
    <section className="text-muted-foreground mt-3 text-center text-xs sm:!text-xs">
      <p>
        By continuing, you agree to our{" "}
        <LocaleLink href="/privacy-policy" className="text-primary hover:underline dark:!text-white">
          Privacy Policy
        </LocaleLink>{" "}
        and{" "}
        <LocaleLink href="/terms-and-condition" className="text-primary hover:underline dark:!text-white">
          Terms &amp; Conditions.
        </LocaleLink>
      </p>
    </section>
  );

  const renderActionButtons = () => (
    <section className="flex flex-col items-center justify-center gap-5 pt-6">
      <SkiButton
        isDisabled={!isValid}
        isLoading={isSigningUp}
        size="lg"
        className="h-12 w-full rounded-full sm:h-14"
        variant="primary"
        type="submit"
      >
        {isSigningUp ? tAuth("processing") : tAuth("signup")}
      </SkiButton>
      {/* <span className="text-muted-foreground text-xs sm:text-sm">-------------------- OR --------------------</span>
      <SkiButton
        size="lg"
        className="border-primary text-primary h-12 w-full rounded-full sm:h-14"
        variant="outline"
        isRightIconVisible
        icon={<FaGoogle />}
        isDisabled={isGooglePending}
        isLoading={isGooglePending}
        onClick={handleGoogleSignIn}
      >
        Signup with Google
      </SkiButton> */}
    </section>
  );

  const renderLoginPrompt = () => (
    <p className="text-muted-foreground mt-6 text-center text-sm sm:text-base">
      {tAuth("alreadyHaveAccount")}{" "}
      <LocaleLink href={`/${locale}/login`} className="text-primary font-medium hover:underline dark:text-white">
        {tAuth("login")}
      </LocaleLink>
    </p>
  );

  const renderSignupForm = () => (
    <section className="px-1">
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          formError ? "mb-4 max-h-20 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="bg-destructive rounded-md border p-2 text-center text-xs font-medium !text-white sm:text-sm">
          {formError}
        </p>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          {renderFormFields()}
          {renderTermsSection()}
          {renderActionButtons()}
          {renderLoginPrompt()}
        </form>
      </FormProvider>
    </section>
  );

  return renderSignupForm();
};
