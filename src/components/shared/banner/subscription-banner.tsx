import { BlurImage } from "@/components/core/miscellaneous/blur-image";
import { cn } from "@/lib/utils";
import { FC } from "react";

import { LocaleLink } from "../locale-link";

const SubscriptionBanner: FC = () => {
  return (
    <LocaleLink
      href={"/dashboard/settings/supscription"}
      className={cn(`bg-accent flex items-center gap-4 rounded-xl p-4 lg:p-8`)}
    >
      <BlurImage
        src={"/images/star-seller-white.svg"}
        alt={"Star Seller"}
        width={80}
        height={80}
        className={`h-[50px] w-[50px] lg:h-[80px] lg:w-[80px]`}
        style={{ height: "auto" }}
      />
      <div>
        <h4 className="dark:text-mid-grey-II !text-base !tracking-wide !text-white lg:!text-3xl">{`Become a Star Seller`}</h4>{" "}
        {/* Responsive text */}
        <p className={`dark:text-mid-grey-II max-w-3xl text-[9px] !font-medium !text-white lg:!text-lg`}>
          {`Stand out and grow faster with boosted product visibility, verified badge, and access to premium tools.`}
        </p>
      </div>
    </LocaleLink>
  );
};

export default SubscriptionBanner;
