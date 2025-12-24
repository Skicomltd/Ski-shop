"use client";

import { Wrapper } from "@/components/core/layout/wrapper";
import { BlurImage } from "@/components/core/miscellaneous/blur-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

import { SpinToWinModal } from "../spin-to-win-modal";

const PlayToWinBanner = () => {
  const t = useTranslations("home.playToWin");

  return (
    <Wrapper>
      <section
        className={`bg-accent/20 dark:bg-muted flex flex-col-reverse items-center justify-between gap-6 rounded-lg p-6 lg:flex-row lg:gap-10 lg:px-[62px] lg:py-[48px]`}
      >
        <div className={`max-w-[456px] space-y-[12px]`}>
          <Badge variant={`default`} className={`bg-accent rounded-md px-[12px] py-2`}>
            {t("badge")}
          </Badge>
          <h1 className={`!text-foreground !mb-0 text-2xl !leading-[56px] lg:!text-5xl`}>{t("title")}</h1>
          <p className={`!font-medium md:!text-xl`}>{t("description")}</p>

          <SpinToWinModal autoOpen={false}>
            <Button disabled size={`xl`} variant={`default`} className={`bg-black text-white`}>
              {/* {t("action")} */}
              Coming Soon
            </Button>
          </SpinToWinModal>
        </div>
        <div>
          <BlurImage
            priority
            src="https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto/v1758671591/skicom/aucizgph1fg1dj4m2nw4.png"
            alt="wheel"
            height={419}
            width={479}
            className={`object-contain`}
          />
        </div>
      </section>
    </Wrapper>
  );
};

export default PlayToWinBanner;
