"use client";

import { ReusableBanner } from "@/components/shared/banner";
import SkiButton from "@/components/shared/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FaApple } from "react-icons/fa";

import Playstore from "~/images/Playstore.png";

export const MobileDownloadBanner = () => {
  const t = useTranslations("home.mobileDownload");

  return (
    <ReusableBanner
      asChild
      image="https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto/v1758641971/skicom/u2pl8unk5rtp8zg2vscr.png"
      imageStyle={`lg:right-[5rem] bottom-[-3rem] lg:bottom-[-1rem] block`}
      className={`min-h-[493px] flex-col overflow-hidden rounded-[25px] bg-black text-white`}
    >
      <div className={`w-full max-w-[457px] flex-1`}>
        <h3 className="mt-4 text-xl !text-white md:!text-2xl lg:!text-3xl">{t("title")}</h3>
        <p className={`my-[22px] font-[300] !text-white md:!text-base lg:!text-lg`}>{t("description")}</p>
        <div className={`mt-8 flex flex-col gap-4 lg:flex-row`}>
          <SkiButton className={`h-[54px] w-full rounded-md bg-white px-4 text-black`}>
            <section className={`flex items-center gap-2`}>
              <FaApple size={`2rem`} />
              <div className={`flex flex-col items-start space-y-[-0.2rem]`}>
                <span className={`text-xs`}>{t("appStore.subtitle")}</span>
                <span className={`text-lg`}>{t("appStore.title")}</span>
              </div>
            </section>
          </SkiButton>
          <SkiButton className={`h-[54px] w-full rounded-md bg-white px-4 text-black`}>
            <section className={`flex items-center gap-2`}>
              {/* <FaGooglePlay size={`2rem`} /> */}
              <Image src={Playstore} alt={"Google Play"} height={30} />
              <div className={`flex flex-col items-start space-y-[-0.2rem]`}>
                <span className={`text-xs`}>{t("googlePlay.subtitle")}</span>
                <span className={`text-lg`}>{t("googlePlay.title")}</span>
              </div>
            </section>
          </SkiButton>
        </div>
      </div>
    </ReusableBanner>
  );
};
