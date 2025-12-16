"use client";

import type { ReactNode } from "react";

type HeroAdLayoutProperties = {
  /**
   * Left advert slot – typically a tall banner (image, video, GIF, etc.)
   */
  leftAd?: ReactNode;
  /**
   * Center/main advert slot – e.g. a hero banner, slider or carousel.
   */
  mainAd?: ReactNode;
  /**
   * Top-right advert slot – e.g. a smaller promo card.
   */
  rightTopAd?: ReactNode;
  /**
   * Bottom-right advert slot – e.g. another promo card.
   */
  rightBottomAd?: ReactNode;
};

export const Hero = ({ leftAd, mainAd, rightTopAd, rightBottomAd }: HeroAdLayoutProperties) => {
  const defaultLeftAd = <div className="h-full bg-black/50"></div>;

  const defaultMainAd = <div className="h-full bg-black/50"></div>;

  const defaultRightTopAd = <div className="h-full bg-black/50"></div>;

  const defaultRightBottomAd = <div className="h-full bg-black/50"></div>;
  return (
    <section className="bg-primary flex min-h-[70dvh] w-full items-stretch bg-[url('/images/shop/shop-hero.svg')] bg-center bg-no-repeat text-white xl:bg-cover">
      <div className="mx-auto flex w-full flex-col gap-6 px-4 sm:gap-8 md:px-6 lg:px-0">
        {/* Advert layout (Jumia‑style hero) */}
        <div className="grid h-full grid-cols-1 gap-1 md:grid-cols-5">
          {/* Left tall advert */}
          <div className="">
            <div className="h-full">{leftAd ?? defaultLeftAd}</div>
          </div>

          {/* Center/main advert (banner or carousel) */}
          <div className="h-full md:col-span-3">
            <div className="h-full w-full">{mainAd ?? defaultMainAd}</div>
          </div>

          {/* Right stacked adverts */}
          <div className="flex h-full flex-col gap-1">
            <div className="h-full w-full">
              <div className="h-full">{rightTopAd ?? defaultRightTopAd}</div>
            </div>

            <div className="h-full w-full">
              <div className="h-full w-full">{rightBottomAd ?? defaultRightBottomAd}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
