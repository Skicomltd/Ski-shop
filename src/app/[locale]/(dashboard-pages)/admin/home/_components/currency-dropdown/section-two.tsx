import { DashboardHeader } from "@/app/[locale]/(dashboard-pages)/_components/dashboard-header";
import Loading from "@/app/Loading";
import { BlurImage } from "@/components/core/miscellaneous/blur-image";
import { Icons } from "@/components/core/miscellaneous/icons";
import { PayrollLineChart } from "@/components/shared/chart/payrool-linechart";
import { EmptyState, ErrorState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Locale } from "@/lib/i18n/config";
import { formatCurrency } from "@/lib/i18n/utils";
import { useAppService } from "@/services/externals/app/use-app-service";
import { useLocale } from "next-intl";

export function SectionTwo() {
  return (
    <section className="grid grid-cols-1 gap-5 py-5 md:grid-cols-12">
      <section className={`col-span-12 lg:col-span-8`}>
        <PayrollLineChart />
      </section>
      <section className={`col-span-12 lg:col-span-4`}>
        <BestSellerLayout />
      </section>
    </section>
  );
}

const BestSellerLayout = () => {
  const { useGetAllProducts } = useAppService();
  const locale = useLocale();
  const { data: productData, isLoading: isProductsLoading, isError } = useGetAllProducts({ flag: "top", limit: 4 });

  if (isError) {
    return <ErrorState />;
  }

  return (
    <Card className={`h-full border-none p-6 shadow-sm`}>
      <DashboardHeader
        icon={<Icons.product className="mt-[-2] size-4" />}
        showSubscriptionBanner={false}
        title="Best Sellers"
        titleClassName={`!text-lg`}
        subtitle={`The best selling products on Skishop`}
        subtitleClassName={`!text-sm`}
      />
      <section className={`hide-scrollbar h-[290px] space-y-4 overflow-auto`}>
        {isProductsLoading ? (
          <Loading text="Loading best selling products..." className="w-fill h-fit p-20" />
        ) : productData?.data?.items?.length ? (
          productData.data.items.map((product) => (
            <div key={product.id} className={`flex items-center justify-between gap-4`}>
              <div className={`flex items-center gap-4`}>
                <div className={`flex size-[60px] items-center justify-center overflow-hidden rounded-lg bg-black/30`}>
                  <BlurImage
                    src={product.images[0]}
                    alt={product.name}
                    width={60}
                    height={60}
                    className={`h-fit w-fit rounded-lg object-contain`}
                  />
                </div>
                <div>
                  <h6 title={product.name} className={`!text-primary max-w-[140px] truncate !text-base !font-black`}>
                    {product.name}
                  </h6>
                  <p className={`text-muted text-sm`}> {product.category.replaceAll(/([a-z])([A-Z])/g, "$1 $2")}</p>
                </div>
              </div>
              <p className={`text-muted text-xs`}>{formatCurrency(product.price, locale as Locale)}</p>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center">
            <EmptyState
              title="No products found"
              description="No best selling products available."
              className="!min-h-[100px]"
            />
          </div>
        )}
      </section>
    </Card>
  );
};
