export const ShopCardSkeleton = () => (
  <div className="animate-pulse rounded-lg bg-no-repeat p-2 md:p-4">
    <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-gray-200 md:mb-4" />
    <div className="space-y-2">
      <div className="h-3 w-16 rounded bg-gray-200" />
      <div className="h-4 w-3/4 rounded bg-gray-200" />
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-gray-200" />
        <div className="h-4 w-14 rounded bg-gray-200" />
      </div>
      <div className="h-3 w-1/2 rounded bg-gray-200" />
      <div className="h-5 w-24 rounded bg-gray-200" />
      <div className="h-9 w-full rounded bg-gray-200" />
    </div>
  </div>
);
