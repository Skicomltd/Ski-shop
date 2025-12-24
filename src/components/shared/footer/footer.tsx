"use client";

import { Wrapper } from "@/components/core/layout/wrapper";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// import Apple from "~/images/Apple.png";
import facebook from "~/images/facebook.png";
import instagram from "~/images/instagram.png";
import tiktok from "~/images/tiktok.png";
// import Playstore from "~/images/Playstore.png";
import twitter from "~/images/twitter.png";
import youtube from "~/images/youtube.png";
import { NewsLetter } from "./news-letter/news-letter";

export const Footer = () => {
  const getYear = new Date().getFullYear();
  const pathname = usePathname();
  const t = useTranslations("footer");

  // Normalize path to remove the locale segment (e.g., "/en/about" -> "/about")
  const normalizedPath = (() => {
    if (!pathname) return "/";
    const parts = pathname.split("/");
    if (parts.length > 2) {
      const rest = parts.slice(2).join("/");
      return rest ? `/${rest}` : "/";
    }
    return "/";
  })();

  return (
    <main className="mt-20 w-full bg-black py-10 md:py-14">
      <Wrapper>
        <section>
          <div>
            <NewsLetter />
          </div>

          <div className="mt-10 flex items-center justify-center gap-3 xl:hidden">
            {/* <a href="" className="rounded-lg border p-2 pr-3 md:flex-none">
              <div className="flex items-center gap-2">
                <Image src={Playstore} alt={"Google Play"} height={30} />
                <div className="text-white">
                  <p className="-mb-1 text-xs">{t("getItOn")}</p>
                  <p className="mt-0 text-sm">{t("googlePlay")}</p>
                </div>
              </div>
            </a>

            <a href="" className="rounded-lg border p-2 md:flex-none">
              <div className="flex items-center gap-2">
                <Image src={Apple} alt={"App Store"} height={30} />
                <div className="text-white">
                  <p className="-mb-1 text-xs">{t("downloadOnThe")}</p>
                  <p className="mt-0 text-sm">{t("appStore")}</p>
                </div>
              </div>
            </a> */}
          </div>

          <div className="mt-10 items-center justify-between text-center text-white xl:flex xl:text-left">
            <div className="flex flex-col items-center justify-center xl:block">
              <Image
                src={`https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto/v1759015059/skicom/zgwlfx3dkbzstxdgcrvj.svg`}
                alt={"Skicom Logo"}
                height={50}
                width={100}
                className={`rounded-md bg-white p-1`}
              />
              <div className="mt-5 flex items-center gap-4">
                <a
                  href="https://www.instagram.com/skishop_official/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border p-2"
                >
                  <Image src={instagram} alt="Instagram" className="h-[25px] w-[25px] rounded-full" />
                </a>
                <a
                  href="https://business.facebook.com/latest/posts/published_posts/?business_id=1171025464209400"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border p-2"
                >
                  <Image src={facebook} alt="Facebook" className="h-[25px] w-[25px] rounded-full" />
                </a>
                <a
                  href="https://x.com/Skicomlimited"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border p-2"
                >
                  <Image src={twitter} alt="Twitter" className="h-[25px] w-[25px] rounded-full" />
                </a>
                <a
                  href="https://www.tiktok.com/@skishop_official"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border p-2"
                >
                  <Image src={tiktok} alt="TikTok" className="h-[25px] w-[25px] rounded-full" />
                </a>
                <a
                  href="https://www.youtube.com/@SkiShop_Official"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border p-2"
                >
                  <Image src={youtube} alt="YouTube" className="h-[25px] w-[25px] rounded-full" />
                </a>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center xl:mt-0 xl:block">
              <h6 className="text-sm font-semibold !text-white uppercase">{t("contactInfo.title")}</h6>
              <p className="mt-5 text-sm text-white">49 Adeyemi Street, Otubu Bus Stop, Agege, Lagos.</p>
              <div className="mt-2 flex items-center gap-1">
                <a href={`tel:${t("contactInfo.phone1")}`} className="text-sm text-white">
                  07075366539,
                </a>
                {/* <a href={`tel:${t("contactInfo.phone2")}`} className="text-sm text-white">
                  {t("contactInfo.phone2")}
                </a> */}
              </div>
            </div>

            <div className="mt-10 flex flex-col justify-center xl:mt-0 xl:block">
              <h6 className="text-sm !font-semibold !text-white uppercase">{t("quickLinks.title")}</h6>
              <div className="flex flex-col xl:flex-row xl:items-center xl:gap-20">
                <div className="mt-5 flex flex-col gap-2">
                  <Link
                    href="/about"
                    className={`text-sm ${normalizedPath.startsWith("/about") ? "text-primary font-bold" : ""}`}
                  >
                    {t("about")}
                  </Link>
                  <Link href="/" className={`text-sm ${normalizedPath === "/" ? "text-primary font-bold" : ""}`}>
                    {t("explore")}
                  </Link>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  <Link
                    href="/shop"
                    className={`text-sm ${normalizedPath.startsWith("/shop") ? "text-primary font-bold" : ""}`}
                  >
                    {t("shop")}
                  </Link>
                  <Link
                    href="/contact"
                    className={`text-sm ${normalizedPath.startsWith("/contact") ? "text-primary font-bold" : ""}`}
                  >
                    {t("contact")}
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col justify-center lg:mt-0 xl:block">
              <h6 className="text-sm !font-semibold !text-white uppercase">{t("help")}</h6>
              {/* <div className="flex items-center gap-20"> */}
              <div className="mt-5 flex flex-col gap-2">
                <Link
                  href="/live-chat"
                  className={`text-sm ${normalizedPath.startsWith("/live-chat") ? "text-primary font-bold" : ""}`}
                >
                  {t("liveChat")}
                </Link>
                <Link
                  href="/terms-condition"
                  className={`text-sm ${normalizedPath.startsWith("/terms-condition") ? "text-primary font-bold" : ""}`}
                >
                  {t("terms")}
                </Link>
              </div>
            </div>
            {/* </div> */}
          </div>

          <hr className="bg-background/50 my-10" />
          <p className="text-center !text-xs">{t("copyright", { year: getYear })}</p>
        </section>
      </Wrapper>
    </main>
  );
};
