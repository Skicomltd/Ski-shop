"use client";

import { Logo } from "@/components/shared/logo";
import { DeveloperInfo } from "@/lib/dev/developer-info";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const switchSides = pathname.includes("signup");
  const tFooter = useTranslations("footer");

  return (
    <main
      className={cn(
        "flex min-h-screen flex-col-reverse",
        "md:gap-4 lg:h-screen lg:flex-row",
        !switchSides && "lg:flex-row-reverse",
      )}
    >
      {/* Content Section */}
      <section className="flex flex-1 flex-col overflow-y-auto">
        {/* Mobile Image */}
        <div className={`relative h-[10rem] flex-shrink-0 lg:hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          <Image
            width={742}
            height={900}
            className="h-full w-full object-cover object-top"
            src={
              switchSides
                ? "https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto/v1758641977/skicom/qhyhxofrhhj0rnvhm75j.png"
                : "https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto/v1758641981/skicom/eeh7fkzdeb9zubwirbts.png"
            }
            alt="model"
            priority
          />
        </div>

        {/* Scrollable Content */}
        <div className="flex flex-1 flex-col lg:justify-center">
          <div className={`mx-auto w-full max-w-md p-4 py-6 sm:max-w-lg lg:py-8`}>
            <div className={`mb-6 hidden lg:block`}>
              <div className="bg-primary/10 mx-auto w-fit rounded-lg p-2">
                <Logo width={120} height={40} className="text-primary !w-[100px]" />
              </div>
            </div>
            {children}
          </div>

          {/* Footer */}
          <DeveloperInfo>
            <p className="!text-primary mt-auto px-4 pt-4 pb-6 text-center !text-xs md:block lg:pb-8 lg:!text-sm">
              {tFooter("copyright", { year: new Date().getFullYear() })}
            </p>
          </DeveloperInfo>
        </div>
      </section>

      {/* Logo and Image Section - Fixed */}
      <section className="relative hidden flex-1 flex-shrink-0 md:min-h-[50vh] lg:block lg:h-screen lg:overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <Image
          width={742}
          height={900}
          className="h-full w-full object-cover object-top"
          src={
            switchSides
              ? "https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto/v1758641977/skicom/qhyhxofrhhj0rnvhm75j.png"
              : "https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto/v1758641981/skicom/eeh7fkzdeb9zubwirbts.png"
          }
          alt="model"
          priority
        />
      </section>
    </main>
  );
}
