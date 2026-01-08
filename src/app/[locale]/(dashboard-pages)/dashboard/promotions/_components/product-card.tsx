import SkiButton from "@/components/shared/button";
import { Ratings } from "@/components/shared/ratings";
import { Locale } from "@/lib/i18n/config";
import { formatCurrency } from "@/lib/i18n/utils";
import { TrendingUp } from "lucide-react";
import { useLocale } from "next-intl";
import Image from "next/image";

interface ProductPromotionCardProperties {
  product: Product;
  onPromote: (product: { id: string; name: string; price: number }) => void;
}

export function ProductPromotionCard({ product, onPromote }: ProductPromotionCardProperties) {
  const locale = useLocale() as Locale;

  return (
    <div className="relative block rounded-lg bg-white bg-no-repeat p-2 shadow-sm">
      <div>
        <Image
          src={product.images[0]}
          alt={product.name}
          width={200}
          height={100}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="space-y-2">
        <p className="text-mid-grey-II text-[10px] capitalize lg:text-sm">{product.category}</p>
        <p className="!text-foreground line-clamp-2 text-xs !font-medium lg:text-sm">{product.name}</p>
        <Ratings rating={product.rating} />
        {/* <p className={`text-mid-grey-II text-[10px] underline lg:text-sm`}>By {product.store.name || "Skicom"}</p> */}
        <div className="flex items-baseline gap-2">
          <p className="!text-foreground text-xs !font-medium lg:text-[16px]">
            {formatCurrency(product.price, locale)}
          </p>
        </div>
        <SkiButton
          onClick={() => onPromote({ id: product.id, name: product.name, price: product.price })}
          className="border-primary text-primary mt-3 w-full"
          variant={"outline"}
          isLeftIconVisible
          icon={<TrendingUp className="mr-2 h-4 w-4" />}
        >
          Promote
        </SkiButton>
      </div>
    </div>
  );
}
