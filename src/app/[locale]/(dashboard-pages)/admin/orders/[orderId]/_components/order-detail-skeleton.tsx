import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const OrderDetailSkeleton = () => {
  return (
    <section className="space-y-8">
      {/* Header skeleton to mirror DashboardHeader */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="hidden md:block">
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>

      <section className="space-y-6">
        {/* Order Details section skeleton (matches Details.Section + Details.Grid) */}
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-sm">
              <Skeleton className="h-4 w-28" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="min-h-12">
                  <Skeleton className="h-3 w-24" />
                  <div className="mt-2">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Items section skeleton */}
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-sm">
              <Skeleton className="h-4 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded object-cover" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Info section skeleton */}
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-sm">
              <Skeleton className="h-4 w-28" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="min-h-12">
                  <Skeleton className="h-3 w-24" />
                  <div className="mt-2">
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </section>
  );
};
