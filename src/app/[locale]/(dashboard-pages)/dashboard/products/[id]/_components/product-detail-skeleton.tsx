import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

const ProductDetailSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header (DashboardHeader approximation) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md border border-gray-200">
            <ArrowLeft className="h-8 w-8 p-1 text-gray-400" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: main image + thumbnails */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="aspect-square w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Right: product info, description, meta, pricing, actions */}
        <div className="bg-background space-y-6 rounded-lg p-6">
          {/* Title, category, status badge */}
          <div className="space-y-2">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          {/* Description/editor area */}
          <div className="border-border space-y-3 border-t pt-4">
            <Skeleton className="h-5 w-28" />
            <div className="space-y-2">
              {[0, 1, 2, 3].map((index) => (
                <Skeleton key={index} className="h-4 w-full" />
              ))}
            </div>
          </div>

          {/* Details grid (Weight, Store, Added by, Created, Last updated) */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-4 w-36" />
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-4">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
