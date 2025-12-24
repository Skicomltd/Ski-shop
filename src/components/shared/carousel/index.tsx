/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { A11y, Autoplay, EffectFade, FreeMode, Navigation, Pagination, Scrollbar, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import { cn } from "@/lib/utils";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";

import SkiButton from "../button";

interface UniversalSwiperProperties<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  swiperOptions?: any;
  showNavigation?: boolean;
  showPagination?: boolean;
  showScrollbar?: boolean;
  className?: string;
  swiperClassName?: string;
  slideClassName?: string;
  thumbsSwiper?: SwiperType | null;
  breakpoints?: any;
  freeMode?: boolean;
  onSwiperInit?: (swiper: SwiperType) => void;
}

export const UniversalSwiper = <T,>({
  items,
  renderItem,
  swiperOptions = {},
  showNavigation = false,
  showPagination = false,
  showScrollbar = false,
  className,
  swiperClassName,
  slideClassName,
  thumbsSwiper,
  breakpoints,
  freeMode = false,
  onSwiperInit,
}: UniversalSwiperProperties<T>) => {
  const swiperReference = useRef<SwiperType | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup swiper instance on unmount
      if (swiperReference.current) {
        swiperReference.current.destroy(true, true);
      }
    };
  }, []);

  if (!items?.length) return null;

  const modules = [
    ...(showNavigation ? [Navigation] : []),
    ...(showPagination ? [Pagination] : []),
    ...(showScrollbar ? [Scrollbar] : []),
    ...(freeMode ? [FreeMode] : []),
    ...(thumbsSwiper ? [Thumbs] : []),
    ...(swiperOptions?.effect === "fade" ? [EffectFade] : []),
    Autoplay,
    A11y,
  ];

  return (
    <div className={cn("relative", className)}>
      <Swiper
        {...swiperOptions}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={modules}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        breakpoints={breakpoints}
        freeMode={freeMode}
        className={cn("w-full", swiperClassName)}
        onSwiper={(swiper) => {
          swiperReference.current = swiper;
          onSwiperInit?.(swiper);
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index} className={cn(slideClassName)}>
            {renderItem(item, index)}
          </SwiperSlide>
        ))}
      </Swiper>

      {showNavigation && (
        <CustomNavigation className="pointer-events-none absolute inset-0" swiperInstance={swiperReference.current} />
      )}
    </div>
  );
};

interface CustomNavigationProperties {
  className?: string;
  iconSize?: number;
  swiperInstance?: SwiperType | null;
}

export const CustomNavigation = ({ className, iconSize = 24, swiperInstance }: CustomNavigationProperties) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (!swiperInstance) return;

    const updateNavigationState = () => {
      setIsBeginning(swiperInstance.isBeginning);
      setIsEnd(swiperInstance.isEnd);
    };

    swiperInstance.on("slideChange", updateNavigationState);
    updateNavigationState(); // Initial update

    return () => {
      swiperInstance.off("slideChange", updateNavigationState);
    };
  }, [swiperInstance]);

  if (!swiperInstance) return null;

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <SkiButton
        onClick={(event) => {
          event.stopPropagation();
          swiperInstance.slidePrev();
        }}
        isDisabled={isBeginning}
        isIconOnly
        icon={<ChevronLeftCircle size={iconSize} />}
        variant="ghost"
        size="circle"
        aria-label="Previous slide"
        className={cn(
          "hover:bg-primary pointer-events-auto z-10 bg-black/50 text-white hover:text-white",
          isBeginning && "cursor-default opacity-0",
        )}
      />
      <SkiButton
        onClick={(event) => {
          event.stopPropagation();
          swiperInstance.slideNext();
        }}
        isDisabled={isEnd}
        isIconOnly
        icon={<ChevronRightCircle size={iconSize} />}
        variant="ghost"
        size="circle"
        aria-label="Next slide"
        className={cn(
          "hover:bg-primary pointer-events-auto z-10 bg-black/50 text-white hover:text-white",
          isEnd && "cursor-default opacity-0",
        )}
      />
    </div>
  );
};
