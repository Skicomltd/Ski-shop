"use client";

import { BlurImage } from "@/components/core/miscellaneous/blur-image";
import SkiButton from "@/components/shared/button";
import { UniversalSwiper } from "@/components/shared/carousel";
import { useAppService } from "@/services/externals/app/use-app-service";
import { BadgePercent, Gift, ShieldCheck, Sparkles, Store, Truck } from "lucide-react";
import type { ReactNode } from "react";
import Marquee from "react-fast-marquee";

import { ShopCard } from "../../(home)/_components/shop-card/shop-card";

type HeroCarouselSlide = {
  title: string;
  subtitle: string;
  image: string;
  pill?: string;
};

const leftSlides: HeroCarouselSlide[] = [
  {
    title: "Daily Deals",
    subtitle: "Flash discounts across top categories",
    pill: "Up to 40% off",
    image: "/images/black-friday-bg.svg",
  },
  {
    title: "New Arrivals",
    subtitle: "Fresh picks, trending now",
    pill: "Just dropped",
    image: "/images/shop/hero.svg",
  },
  {
    title: "Fast Delivery",
    subtitle: "Get it delivered to your doorstep",
    pill: "Nationwide",
    image: "/images/black-friday-tag.svg",
  },
];

type HeroProductItem = Pick<
  Product,
  "id" | "name" | "category" | "images" | "price" | "discountPrice" | "rating" | "store"
>;

const productFallback: HeroProductItem[] = [
  {
    id: "fallback-1",
    name: "Featured product",
    category: "featured",
    price: 45_000,
    discountPrice: 39_999,
    rating: 4.5,
    images: ["/images/playstation.jpg"],
    store: { id: "skicom", name: "Skicom" },
  },
  {
    id: "fallback-2",
    name: "Top seller item",
    category: "top sellers",
    price: 35_000,
    discountPrice: null,
    rating: 4.2,
    images: ["/images/jbl.svg"],
    store: { id: "skicom", name: "Skicom" },
  },
  {
    id: "fallback-3",
    name: "New arrival",
    category: "new",
    price: 12_000,
    discountPrice: 10_999,
    rating: 4,
    images: ["/images/wheel.png"],
    store: { id: "skicom", name: "Skicom" },
  },
];

const EcomSlideCard = ({ slide }: { slide: HeroCarouselSlide }) => {
  return (
    <div className="relative h-full overflow-hidden bg-black">
      <BlurImage
        fill
        src={slide.image}
        alt={slide.title}
        className="object-cover opacity-90"
        sizes="(max-width: 768px) 100vw, 20vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />

      <div className="relative flex h-full flex-col justify-center p-4">
        {slide.pill && (
          <span className="mb-2 w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20">
            {slide.pill}
          </span>
        )}
        <h3 className="text-2xl leading-tight font-semibold !text-white">{slide.title}</h3>
        <p className="mt-1 text-sm !text-white/80">{slide.subtitle}</p>
        <div className="mt-4">
          <SkiButton href="/shop" variant="primary" size="lg" className="bg-white text-black hover:bg-white/90">
            Shop now
          </SkiButton>
        </div>
      </div>
    </div>
  );
};

const SellerCtaCard = () => {
  return (
    <div className="relative h-full overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_40%),radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.12),transparent_45%)]" />
      <div className="relative flex h-full flex-col justify-between gap-4 p-5 ring-1 ring-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-white/90" aria-hidden="true" />
            <p className="text-xs font-semibold tracking-wide text-white">SELL ON SKICOM</p>
          </div>
          <h3 className="mt-2 text-xl leading-tight font-semibold !text-white">Become a seller</h3>
          <p className="mt-2 text-sm text-white/80">
            Reach more customers, manage orders, and grow your business with powerful seller tools.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <SkiButton
            href="/signup/vendor"
            variant="primary"
            size="lg"
            className="bg-accent hover:bg-accent/90 w-full text-black"
          >
            Start selling
          </SkiButton>
          <SkiButton
            href="/shop"
            variant="outline"
            size="lg"
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            Learn more
          </SkiButton>
        </div>
      </div>
    </div>
  );
};

const TrustAndPerksCard = () => {
  return (
    <div className="bg-primary/50 relative h-full overflow-hidden rounded-xl p-5 text-white">
      {/* Decorative brand watermark */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rotate-12 [background-image:url('/images/skicom-star.svg')] bg-contain bg-no-repeat opacity-15" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/35" />

      <div className="relative flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-white/90" aria-hidden="true" />
        <h4 className="text-lg font-semibold !text-white">Why shop here</h4>
      </div>
      <ul className="relative mt-4 space-y-3 text-sm text-white/85">
        <li className="flex items-start gap-2">
          <BadgePercent className="mt-0.5 h-5 w-5 text-white/90" aria-hidden="true" />
          <span>Exclusive promos from verified sellers</span>
        </li>
        <li className="flex items-start gap-2">
          <Truck className="mt-0.5 h-5 w-5 text-white/90" aria-hidden="true" />
          <span>Fast delivery & easy pickups</span>
        </li>
        <li className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-white/90" aria-hidden="true" />
          <span>Secure payments and buyer protection</span>
        </li>
      </ul>
    </div>
  );
};

const PlayToWinMarquee = () => {
  return (
    <div className="border-t border-black/10 bg-gradient-to-r from-black to-neutral-900 text-white">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <Marquee gradient={false} speed={38} pauseOnHover>
            <div className="flex items-center gap-6 pr-6 text-sm font-medium">
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-white/90" aria-hidden="true" />
                Play to Win is coming — spin, win vouchers & discounts.
              </span>
              <span className="inline-flex items-center gap-2 text-white/80">
                <Gift className="h-4 w-4" aria-hidden="true" />
                Holiday rewards. Limited drops.
              </span>
            </div>
          </Marquee>
        </div>

        <SkiButton
          isDisabled
          variant="primary"
          size="lg"
          className="bg-accent hover:bg-accent/90 relative overflow-hidden text-black"
        >
          <span className="pointer-events-none absolute inset-0 [transform:translateX(-120%)] animate-[shimmer_2.2s_infinite] opacity-60 [background:linear-gradient(110deg,transparent,rgba(255,255,255,0.55),transparent)]" />
          <span className="relative">Coming soon</span>
        </SkiButton>
      </div>
    </div>
  );
};

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
  const { useGetAllProducts } = useAppService();

  const { data: productData } = useGetAllProducts(
    {
      page: 1,
      limit: 12,
      sortBy: "DESC",
    },
    {
      enabled: !mainAd,
    },
  );

  const productsForCarousel: HeroProductItem[] = (() => {
    const items = (productData?.data?.items ?? []) as Product[];
    const picked = items.slice(0, 12).map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      images: product.images,
      price: product.price,
      discountPrice: product.discountPrice,
      rating: product.rating,
      store: product.store,
    }));

    return picked.length > 0 ? picked : productFallback;
  })();

  const defaultLeftAd = (
    <div className="relative h-full min-h-[320px] bg-black md:min-h-[520px]">
      <UniversalSwiper
        items={leftSlides}
        showNavigation
        swiperOptions={{
          slidesPerView: 1,
          spaceBetween: 12,
          loop: true,
          effect: "fade",
          fadeEffect: { crossFade: true },
          speed: 700,
        }}
        className="h-full"
        swiperClassName="h-full"
        slideClassName="h-full"
        renderItem={(slide) => <EcomSlideCard slide={slide} />}
      />

      {/* Big Sale dangling tag (Black Friday style) */}
      <BlurImage
        priority
        src="/images/big-sale-tag.svg"
        alt="Big Sale"
        width={244}
        height={323}
        className="animate-swing pointer-events-none absolute -top-1 right-2 z-20 h-[88px] w-[88px] object-contain md:h-[112px] md:w-[112px]"
      />
    </div>
  );

  const defaultMainAd = (
    <div className="bg-background h-full min-h-[320px] md:min-h-[520px]">
      <div className="flex h-full flex-col overflow-hidden text-black ring-1 ring-black/5">
        <div className="flex-1 p-4">
          <UniversalSwiper
            items={productsForCarousel}
            showNavigation
            swiperOptions={{
              slidesPerView: 1,
              spaceBetween: 12,
              loop: true,
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 12 },
              1024: { slidesPerView: 3, spaceBetween: 12 },
            }}
            className="h-full"
            swiperClassName="h-full"
            slideClassName="h-full"
            renderItem={(product: HeroProductItem) => (
              <ShopCard
                id={product.id}
                category={product.category}
                title={product.name}
                rating={product.rating}
                price={product.price}
                discount={product.discountPrice || 0}
                image={product.images?.[0] ?? "/images/empty-state.svg"}
                name={product.store?.name || "Skicom"}
              />
            )}
          />
        </div>
        <PlayToWinMarquee />
      </div>
    </div>
  );

  const defaultRightTopAd = (
    <div className="h-full min-h-[240px]">
      <SellerCtaCard />
    </div>
  );

  const defaultRightBottomAd = (
    <div className="h-full min-h-[240px] p-4">
      <TrustAndPerksCard />
    </div>
  );
  return (
    <section className="relative flex min-h-[70dvh] w-full items-stretch overflow-hidden bg-black bg-center bg-no-repeat text-white xl:bg-cover">
      {/* Holiday theming overlays */}
      <div className="pointer-events-none absolute inset-0 [background-image:url('/images/black-friday-bg.svg')] bg-cover bg-center opacity-25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-red-500/15 via-transparent to-black/45" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.10),transparent_45%)]" />
      {/* <section className="bg-primary flex min-h-[70dvh] w-full items-stretch bg-[url('/images/shop/shop-hero.svg')] bg-center bg-no-repeat text-white xl:bg-cover"> */}
      <div className="relative z-10 mx-auto flex w-full flex-col gap-6 px-4 sm:gap-8 md:px-6 lg:px-0">
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
