"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export const SectionOne = () => {
  const t = useTranslations("about.sectionOne");

  return (
    <section
      className={`bg-accent/10 dark:bg-muted flex max-w-[1240px] flex-col-reverse items-center justify-between gap-8 rounded-lg p-6 sm:gap-12 sm:p-8 lg:flex-row lg:gap-20 lg:px-[62px] lg:py-[64px]`}
    >
      <div className={`flex-1`}>
        <span className={`!text-primary dark:!text-accent font-semibold`}>{t("tagTitle")}</span>
        <h2 className={`pt-4 text-xl md:!text-4xl`}>{t("title")}</h2>
        <p className={`my-4 sm:my-6 sm:!text-lg lg:my-[22px]`}>{t("description")}</p>
      </div>
      <Image
        priority
        src="https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto/v1758641979/skicom/j9yvnc33xflppzgzr0xm.png"
        alt="wheel"
        height={440}
        width={455}
        className={`rounded-md`}
      />
    </section>
  );
};
