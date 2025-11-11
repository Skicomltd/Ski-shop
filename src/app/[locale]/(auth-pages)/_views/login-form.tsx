"use client";

import SkiButton from "@/components/shared/button";
import { FormField } from "@/components/shared/inputs/FormFields";
import { LocaleLink } from "@/components/shared/locale-link";
import { createLoginSchema, LoginFormData } from "@/schemas/auth-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export const LoginForm = () => {
  const tAuth = useTranslations("auth");
  // const tCommon = useTranslations("common");
  const locale = useLocale();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const router = useRouter();
  const searchParameters = useSearchParams();

  // Create schema with translations
  const loginSchema = createLoginSchema((key: string) => {
    const keys = key.split(".");
    if (keys[0] === "auth") {
      return tAuth(keys[1]);
    }
    return key;
  });

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
    setError,
  } = methods;

  // Handle URL error parameters (from OAuth redirects)
  useEffect(() => {
    const error = searchParameters.get("error");
    if (error) {
      const decodedError = decodeURIComponent(error);
      toast.error(tAuth("loginFailed"), {
        description: decodedError,
      });

      // Clear the error from URL without page refresh
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("error");
      window.history.replaceState({}, "", newUrl.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParameters]);

  const handleSubmitForm = async (data: LoginFormData) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      let message = result.error as string;
      if (message === "CredentialsSignin") {
        message = tAuth("invalidCredentials");
      }
      toast.error(tAuth("loginFailed"), { description: message });
      if (message.toLowerCase().includes("email")) {
        setError("email", { message });
      } else if (message.toLowerCase().includes("password")) {
        setError("password", { message });
      } else {
        setError("email", { message: " " });
        setError("password", { message });
      }
      return;
    }

    toast.success(tAuth("loginSuccess"));
    router.push(`/${locale}/dashboard/home`);
  };

  const handleGoogleSignIn = () => {
    startGoogleTransition(async () => {
      router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/oauth/google/redirect`);
    });
  };

  return (
    <section className="w-full">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
          <section className="space-y-4 sm:space-y-5">
            <FormField
              placeholder={tAuth("email")}
              className="h-12 w-full sm:h-14"
              label={tAuth("email")}
              name="email"
            />
            <div className="space-y-2">
              <FormField
                type="password"
                placeholder={tAuth("password")}
                className="h-12 w-full sm:h-14"
                label={tAuth("password")}
                name="password"
              />
            </div>
          </section>

          <section className="mt-[-1rem] flex items-center justify-end">
            {/* <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-xs leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 lg:text-sm"
              >
                {tAuth("rememberMe")}
              </label>
            </div> */}
            <LocaleLink href="/forgot-password">
              <p className="!text-destructive !text-xs hover:underline md:!text-sm">{tAuth("forgotPassword")}</p>
            </LocaleLink>
          </section>

          {/* CTA */}
          <section className="flex flex-col items-center justify-center gap-5 pt-2">
            <SkiButton
              isDisabled={isSubmitting || !isValid}
              isLoading={isSubmitting}
              size="lg"
              className="h-12 w-full rounded-full sm:h-14"
              variant="primary"
              type="submit"
            >
              {tAuth("login")}
            </SkiButton>
            <span className="text-muted-foreground text-xs sm:text-sm">
              -------------------- OR --------------------
            </span>
            <SkiButton
              size="lg"
              className="border-primary text-primary h-12 w-full rounded-full sm:h-14"
              variant="outline"
              isRightIconVisible
              icon={<FcGoogle />}
              isDisabled={isGooglePending}
              isLoading={isGooglePending}
              onClick={handleGoogleSignIn}
            >
              {tAuth("signInWithGoogle")}
            </SkiButton>
          </section>

          <p className="text-muted-foreground mt-6 text-center text-sm sm:text-base">
            {tAuth("dontHaveAccount")}{" "}
            <LocaleLink href="/signup" className="text-primary font-medium hover:underline">
              {tAuth("signup")}
            </LocaleLink>
          </p>
        </form>
      </FormProvider>
    </section>
  );
};
