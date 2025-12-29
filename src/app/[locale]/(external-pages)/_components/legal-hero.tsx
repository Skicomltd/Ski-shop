"use client";

import { BreadCrumb } from "@/components/shared/breadcrumb";

type LegalHeroProperties = {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
};

export const LegalHero = ({ title, subtitle, backgroundImage = "/images/shop/shop-hero.svg" }: LegalHeroProperties) => {
  return (
    <header
      className="relative flex min-h-[260px] w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat md:min-h-[360px] lg:min-h-[460px]"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      {/* <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" /> */}

      <div className="relative mx-auto w-full max-w-[1240px] px-4 md:px-6 xl:px-0">
        <div className="pt-[72px] md:pt-[96px]">
          <h1 className="text-center text-3xl font-semibold tracking-tight !text-white md:text-5xl lg:text-[56px]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm !text-white/85 md:text-base">{subtitle}</p>
          ) : null}
          <BreadCrumb />
        </div>
      </div>
    </header>
  );
};
