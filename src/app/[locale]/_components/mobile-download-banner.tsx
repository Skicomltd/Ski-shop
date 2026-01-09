import { Wrapper } from "@/components/core/layout/wrapper";
import { ReusableBanner } from "@/components/shared/banner";
import SkiButton from "@/components/shared/button";
import { cn } from "@/lib/utils";
import { FaApple, FaGooglePlay } from "react-icons/fa";

type MobileDownloadBannerProperties = {
  wrapperClassName?: string;
  bannerClassName?: string;
  imageSource?: string;
  imageClassName?: string;
  title?: string;
  titleClassName?: string;
  description?: string;
  descriptionClassName?: string;
  actionsClassName?: string;
  appStoreButtonClassName?: string;
  playStoreButtonClassName?: string;
  iconSize?: string | number;
};

export const MobileDownloadBanner = ({
  wrapperClassName,
  bannerClassName,
  imageSource = "/images/phone.svg",
  imageClassName = "lg:right-[5rem] bottom-[-3rem] lg:bottom-[-1rem] block",
  title = "Shop Smarter and Faster Anywhere You Are.",
  titleClassName = "mt-4 text-xl !text-white md:text-2xl lg:text-3xl",
  description = "Get the Ski-Shop app and unlock seamless shopping, faster deliveries, wallet access, and exclusive deals all in your pocket.",
  descriptionClassName = "text-mid-grey-II my-[22px] text-lg font-[300] lg:text-lg",
  actionsClassName = "mt-8 flex flex-col gap-4 lg:flex-row",
  appStoreButtonClassName = "h-[50px] w-full rounded-md px-4",
  playStoreButtonClassName = "h-[50px] w-full rounded-md px-4",
  iconSize = "2rem",
}: MobileDownloadBannerProperties) => {
  return (
    <Wrapper className={cn("my-[78px]", wrapperClassName)}>
      <ReusableBanner
        asChild
        image={imageSource}
        imageStyle={cn(imageClassName)}
        className={cn("min-h-[493px] flex-col overflow-hidden rounded-[25px] bg-black text-white", bannerClassName)}
      >
        <div className={`w-full max-w-[457px] flex-1`}>
          <h3 className={cn(titleClassName)}>{title}</h3>
          <p className={cn(descriptionClassName)}>{description}</p>
          <div className={cn(actionsClassName)}>
            <SkiButton className={cn(appStoreButtonClassName)}>
              <section className={`flex items-center gap-2`}>
                <FaApple size={iconSize} />
                <div className={`flex flex-col items-start space-y-[-0.2rem]`}>
                  <span className={`text-xs`}>Download on the</span>
                  <span className={`text-lg`}>App Store</span>
                </div>
              </section>
            </SkiButton>
            <SkiButton className={cn(playStoreButtonClassName)}>
              <section className={`flex items-center gap-2`}>
                <FaGooglePlay size={iconSize} />
                <div className={`flex flex-col items-start space-y-[-0.2rem]`}>
                  <span className={`text-xs`}>Download on the</span>
                  <span className={`text-lg`}>Google Play</span>
                </div>
              </section>
            </SkiButton>
          </div>
        </div>
      </ReusableBanner>
    </Wrapper>
  );
};
