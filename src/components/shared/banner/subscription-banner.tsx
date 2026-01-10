"use client";

import { BlurImage } from "@/components/core/miscellaneous/blur-image";
import { cn } from "@/lib/utils";
import { FC, useEffect, useRef, useState } from "react";

import { LocaleLink } from "../locale-link";

const SubscriptionBanner: FC = () => {
  const DESCRIPTIONS = [
    "Stand out and grow faster with boosted product visibility, verified badge, and access to premium tools.",
    "Increase your reach with prioritized placement and earn trust with a Star Seller badge.",
    "Unlock premium analytics, promotional boosts, and tools to scale your store.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const timeoutReference = useRef<number | null>(null);
  const intervalReference = useRef<number | null>(null);

  useEffect(() => {
    intervalReference.current = window.setInterval(() => {
      setIsFading(true);
      timeoutReference.current = window.setTimeout(() => {
        setCurrentIndex((previous) => (previous + 1) % DESCRIPTIONS.length);
        setIsFading(false);
      }, 300);
    }, 5000);

    return () => {
      if (intervalReference.current) window.clearInterval(intervalReference.current);
      if (timeoutReference.current) window.clearTimeout(timeoutReference.current);
    };
  }, [DESCRIPTIONS.length]);

  return (
    <LocaleLink
      href={"/dashboard/settings/supscription"}
      className={cn(
        `flex min-h-[158px] items-center gap-4 rounded-xl border border-[#007cc3] bg-[#007cc3]/10 p-4 lg:p-8`,
      )}
    >
      <BlurImage
        src={"/images/skicom-star.svg"}
        alt={"Star Seller"}
        width={80}
        height={80}
        className={`h-[50px] w-[50px] lg:h-[80px] lg:w-[80px]`}
        style={{ height: "auto" }}
      />
      <div>
        <h4 className="dark:text-mid-grey-II !text-base !tracking-wide !text-[#007cc3] lg:!text-3xl">{`Become a Star Seller`}</h4>{" "}
        {/* Rotating description with fade animation every 5s */}
        <p
          aria-live="polite"
          className={cn(
            "dark:text-mid-grey-II flex min-h-[56px] max-w-3xl items-center !text-[#007cc3] transition-opacity duration-300",
            "text-[9px] lg:!text-lg",
            isFading ? "opacity-0" : "opacity-100",
          )}
        >
          {DESCRIPTIONS[currentIndex]}
        </p>
      </div>
    </LocaleLink>
  );
};

export default SubscriptionBanner;
