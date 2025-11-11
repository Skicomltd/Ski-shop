"use client";

import { BlurImage } from "@/components/core/miscellaneous/blur-image";
import SkiButton from "@/components/shared/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const heroImages = [
  "https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto/v1758668597/skicom/t2kc2sioj4vt4xgiesnw.svg",
  "https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto/v1758668383/skicom/o7xtwrv8bzpcxnwi0x5b.png",
  "https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto/v1758668382/skicom/qjk1ce1ry52i23xe2ggc.png",
];

type Slide = {
  title: string;
  subtitle: string;
  image: string;
  position: number;
};

const slidePositions = ["center", "left", "right"];

const HeroSlide = ({
  slide,
  position,
  t,
  isAuthenticated,
}: {
  slide: Slide;
  position: string;
  t: (key: string) => string;
  isAuthenticated: boolean;
}) => {
  return (
    <div className="relative min-h-[700px] w-full">
      <BlurImage
        priority
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          slide.position === 0 && `object-right`,
          slide.position === 1 && `object-right`,
          slide.position === 2 && `object-left`,
        )}
        fill
        src={slide.image}
        alt="hero-image"
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 lg:from-black/90 lg:to-transparent",
          slide.position === 2 && `lg:from-transparent lg:to-black/90`,
        )}
      />
      <section className="mx-auto max-w-[1240px]">
        <div
          className={cn(
            "relative z-10 flex min-h-[600px] flex-col text-white",
            position === "center"
              ? "items-center justify-center text-center"
              : position === "left"
                ? "items-center justify-center text-center lg:items-start lg:justify-center lg:text-left"
                : "items-center justify-center text-center lg:items-end lg:justify-center lg:text-right",
          )}
        >
          <div className="mt-30 max-w-2xl space-y-[12px]">
            <h1 className="!text-[32px] leading-[44px] font-bold !text-white lg:!text-[48px] lg:leading-[78px]">
              {slide.title}
            </h1>
            <p className="!text-mid-grey-I !text-base lg:!text-xl">{slide.subtitle}</p>
          </div>
          <div className="mx-auto mt-8 flex flex-col items-center gap-4 lg:mx-0 lg:flex-row">
            <SkiButton
              href={`/shop`}
              size={`xl`}
              className={cn(
                "w-[220px]",
                position === "left" && "bg-accent",
                position === "right" && "bg-white text-black",
              )}
              variant="primary"
            >
              {position === "center" ? t("shopNow") : position === "left" ? t("subscribeNow") : t("joinNow")}
            </SkiButton>
            {!isAuthenticated && (
              <SkiButton href={`/signup/vendor`} size={`xl`} className={cn("w-[220px] text-white")} variant="outline">
                {t("becomeSeller")}
              </SkiButton>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWindowLoaded, setIsWindowLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState(0);
  const { status } = useSession();
  const t = useTranslations("home.hero");
  const slides = t.raw("slides");
  const isReady = isWindowLoaded && loadedImages >= heroImages.length;
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    const handleLoad = () => setIsWindowLoaded(true);
    if (typeof window !== "undefined") {
      if (document.readyState === "complete") {
        setIsWindowLoaded(true);
      } else {
        window.addEventListener("load", handleLoad);
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("load", handleLoad);
      }
    };
  }, []);

  useEffect(() => {
    let isCanceled = false;

    const imageElements: HTMLImageElement[] = [];

    const handleDone = () => {
      if (!isCanceled) setLoadedImages((previous) => previous + 1);
    };

    for (const source of heroImages) {
      const img = new Image();
      imageElements.push(img);
      img.addEventListener("load", handleDone);
      img.addEventListener("error", handleDone);
      img.src = source;
    }

    return () => {
      isCanceled = true;
      for (const img of imageElements) {
        img.removeEventListener("load", handleDone);
        img.removeEventListener("error", handleDone);
      }
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((previous) => (previous + 1) % heroImages.length);
    }, 50_000);

    return () => clearInterval(interval);
  }, [isReady]);

  return (
    <section className="bg-subtle relative overflow-hidden">
      <div
        className={cn(
          "flex h-full w-[300%]",
          isReady ? "transition-transform duration-[2.5s] ease-in-out" : "transition-none",
        )}
        style={{ transform: isReady ? `translateX(-${currentImageIndex * (100 / 3)}%)` : "translateX(0%)" }}
      >
        {slides.map((slide: { title: string; subtitle: string; position: number }, index: number) => (
          <HeroSlide
            key={index}
            slide={{ ...slide, image: heroImages[index], position: index }}
            position={slidePositions[index]}
            t={t}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>

      {/* Carousel indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 transform justify-center gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            disabled={!isReady}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              currentImageIndex === index ? "bg-accent w-6" : "bg-white",
              !isReady && "cursor-not-allowed opacity-50",
            )}
            onClick={() => {
              if (!isReady) return;
              setCurrentImageIndex(index);
            }}
          />
        ))}
      </div>
    </section>
  );
};
