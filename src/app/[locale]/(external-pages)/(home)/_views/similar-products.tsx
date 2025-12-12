import { useAppService } from "@/services/externals/app/use-app-service";

import { ShopCard } from "../_components/shop-card/shop-card";
import { ShopCardSkeleton } from "../../_components/shop-card-skeleton";

interface SimilarProductsProperties {
  currentProductId: string;
  category: string;
}

export const SimilarProducts = ({ currentProductId, category }: SimilarProductsProperties) => {
  const { useGetSimilarProducts } = useAppService();
  const { isLoading, data } = useGetSimilarProducts(currentProductId, {});
  const similarProducts = data?.data?.items?.filter((product) => product.category === category).slice(0, 4);

  return (
    <div className="space-y-6">
      <h2 className="!text-xl lg:!text-4xl lg:!leading-[41.62px] lg:!tracking-[1px]">Similar Products</h2>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading &&
          Array.from({ length: 12 }).map((_, index: number) => {
            return <ShopCardSkeleton key={index} />;
          })}
        {!isLoading && similarProducts?.length === 0 && (
          <div className="col-span-full py-10 text-center">
            <p className="text-lg">No products found matching your filters</p>
          </div>
        )}
        {similarProducts?.map((product) => {
          return (
            <ShopCard
              key={product.id.toString()}
              id={product.id.toString()}
              category={product.category}
              title={product.name}
              rating={product.rating || 0}
              price={product.price}
              discount={product.discountPrice || 0}
              image={product.images[0]}
              name={product.store.name}
            />
          );
        })}
      </div>
    </div>
  );
};
