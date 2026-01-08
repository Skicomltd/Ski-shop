// import { useRouter } from "next/navigation";

import { BlurImage } from "@/components/core/miscellaneous/blur-image";
import { Tooltip } from "@/components/ui/tooltip";
import { Locale } from "@/lib/i18n/config";
import { formatCurrency, formatDate, formatTime } from "@/lib/i18n/utils";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

import { User } from "./type";

// export const useEmployeeproductActions = () => {
//   const router = useRouter();

//   const getproductActions = (employee: Employee) => {
//     const actions: IproductAction<Employee>[] = [];
//     actions.push(
//       {
//         label: "View employee",
//         onClick: async () => {
//           router.push(`/admin/employees/${employee.id}`);
//         },
//         // icon: <MinusCircle className={`text-high-warning`} />,
//       },
//       {
//         label: "Edit Employee",
//         onClick: () => {
//           router.push(`/admin/employees/add-employee?employeeid=${employee.id}`);
//         },
//         // icon: <Eye className={`text-high-primary`} />,
//       },
//     );
//     return actions;
//   };
//   return { getproductActions };
// };

export const useOrderColumn = (): TableColumnDefinition<Order>[] => {
  const locale = useLocale();

  return [
    {
      header: "Products",
      accessorKey: "items",
      render: (_, order: Order) => {
        const items: Array<{ product?: { images?: string[]; name?: string }; quantity?: number }> = Array.isArray(
          (order as unknown as { items?: unknown }).items,
        )
          ? ((order as unknown as { items: unknown[] }).items as Array<{
              product?: { images?: string[]; name?: string };
              quantity?: number;
            }>)
          : [];

        const firstItem = items[0];
        const firstImage = firstItem?.product?.images?.[0];
        const additionalProductsCount = items.length > 1 ? items.length - 1 : 0;
        const productName = firstItem?.product?.name || "N/A";
        const quantity = firstItem?.quantity ?? 0;

        return (
          <div className="flex items-center space-x-2">
            <div className="relative">
              {firstImage && (
                <BlurImage
                  src={firstImage}
                  alt={productName}
                  width={40}
                  height={40}
                  className="rounded-md object-cover"
                />
              )}
              {additionalProductsCount > 0 && (
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                  +{additionalProductsCount}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs font-medium">{productName}</div>
              <div className="text-xs text-gray-500">
                {quantity} item{quantity === 1 ? "" : "s"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Order ID",
      accessorKey: "id",
      render: (_, order: Order) => {
        const reference = order.reference ?? "";
        const displayReference = reference
          ? reference.length > 10
            ? `${reference.slice(0, 10)}...`
            : reference
          : "N/A";

        return (
          <span
            className="inline-block max-w-[100px] cursor-help truncate text-xs font-medium"
            title={reference || "N/A"}
          >
            {displayReference}
          </span>
        );
      },
    },
    {
      header: "Total Amount",
      accessorKey: "totalAmount",
      render: (_, order: Order) => {
        const explicitTotal = (order as unknown as { totalAmount?: number }).totalAmount;
        if (typeof explicitTotal === "number") {
          return <span className="text-xs font-medium">{formatCurrency(explicitTotal, locale as Locale)}</span>;
        }

        const items: Array<{ subtotal?: number }> = Array.isArray((order as unknown as { items?: unknown }).items)
          ? ((order as unknown as { items: unknown[] }).items as Array<{ subtotal?: number }>)
          : [];
        const computedTotal = items.reduce(
          (sum, item) => sum + (typeof item.subtotal === "number" ? item.subtotal : 0),
          0,
        );

        return <span className="text-xs font-medium">{formatCurrency(computedTotal, locale as Locale)}</span>;
      },
    },
    {
      header: "Customer Name",
      accessorKey: "order",
      render: (_, order: Order) => (
        <span
          className="inline-block max-w-[100px] cursor-help truncate text-xs font-medium"
          title={order?.buyer?.name ?? "N/A"}
        >
          {order?.buyer?.name ?? "N/A"}
        </span>
      ),
    },
    {
      header: "Date and Time",
      accessorKey: "createdAt",
      render: (_, order: Order) => {
        return (
          <div>
            <span className={`text-xs`}>{formatDate(order.createdAt, locale as Locale)}</span> |{" "}
            <span className={`text-xs`}>{formatTime(order.createdAt, locale as Locale)}</span>
          </div>
        );
      },
    },
    {
      header: "Payment Status",
      accessorKey: "status",
      render: (_, order: Order) => {
        const status = String(order.status ?? "");

        return (
          <span
            className={cn(
              `rounded-full px-2 py-1 text-xs capitalize`,
              status === "paid" && "bg-low-success text-mid-success",
              status === "pending" && "bg-yellow-100 text-yellow-600",
              status === "unpaid" && "bg-yellow-100 text-yellow-600",
              status === "cancelled" && "bg-red-100 text-red-600",
              status === "delivered" && "bg-blue-100 text-blue-600",
            )}
          >
            {status || "N/A"}
          </span>
        );
      },
    },
    {
      header: "Delivery Status",
      accessorKey: "items",
      render: (_, order: Order) => {
        const items: Array<{ deliveryStatus?: string }> = Array.isArray((order as unknown as { items?: unknown }).items)
          ? ((order as unknown as { items: unknown[] }).items as Array<{ deliveryStatus?: string }>)
          : [];

        const normalized = items.map((item) => String(item.deliveryStatus ?? "").trim()).filter(Boolean);

        // Aggregate per-item deliveryStatus into a single label for the table.
        // Priority: cancelled > in_transit > pending > uninitiated > delivered (only if all delivered)
        const deliveryStatus =
          normalized.length === 0
            ? ""
            : normalized.every((s) => s === "delivered")
              ? "delivered"
              : normalized.includes("cancelled")
                ? "cancelled"
                : normalized.includes("in_transit")
                  ? "in_transit"
                  : normalized.includes("pending")
                    ? "pending"
                    : normalized.includes("uninitiated")
                      ? "uninitiated"
                      : normalized[0];

        return (
          <span
            className={cn(
              `rounded-full px-2 py-1 text-xs capitalize`,
              deliveryStatus === "delivered" && "bg-low-success text-mid-success",
              deliveryStatus === "pending" && "bg-yellow-100 text-yellow-600",
              deliveryStatus === "uninitiated" && "bg-yellow-100 text-yellow-600",
              deliveryStatus === "in_transit" && "bg-blue-100 text-blue-600",
              deliveryStatus === "cancelled" && "bg-red-100 text-red-600",
            )}
          >
            {deliveryStatus || "N/A"}
          </span>
        );
      },
    },
  ];

  // return [
  //   {
  //     header: "Reference ID",
  //     accessorKey: "reference",
  //     render: (_, order: Order) => (
  //       <span className="!text-sm font-medium">{order.reference?.slice(0, 10) ?? "N/A"}...</span>
  //     ),
  //   },
  //   {
  //     header: "Products",
  //     accessorKey: "items",
  //     render: (_, order: Order) => (
  //       <div className="flex items-center space-x-2">
  //         <div className="relative">
  //           {order.items?.[0]?.product?.images && order.items[0].product.images.length > 0 && (
  //             <BlurImage
  //               src={order.items[0].product.images[0]}
  //               alt={order.items[0].product.name}
  //               width={40}
  //               height={40}
  //               className="rounded-md object-cover"
  //             />
  //           )}
  //           {order.items && order.items.length > 1 && (
  //             <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
  //               +{order.items.length - 1}
  //             </div>
  //           )}
  //         </div>
  //         <div>
  //           <div className="!text-sm font-medium">{order.items?.[0]?.product?.name || "N/A"}</div>
  //           <p className="!text-sm text-gray-500">
  //             {order.items?.[0]?.quantity ?? 0} item{(order.items?.[0]?.quantity ?? 0) > 1 ? "s" : ""}
  //           </p>
  //         </div>
  //       </div>
  //     ),
  //   },
  //   {
  //     header: "Buyer",
  //     accessorKey: "buyer",
  //     render: (_, order: Order) => (
  //       <div>
  //         <p className="!text-sm font-medium">{order.buyer?.name ?? "N/A"}</p>
  //       </div>
  //     ),
  //   },
  //   {
  //     header: "Delivery Address",
  //     accessorKey: "shippingInfo",
  //     render: (_, order: Order) => (
  //       <p className="max-w-xs truncate !text-sm">{order.shippingInfo?.recipientAddress || "N/A"}</p>
  //     ),
  //   },
  //   {
  //     header: "Total Amount",
  //     accessorKey: "totalAmount",
  //     render: (_, order: Order) => (
  //       <span className="!text-sm font-medium">{formatCurrency(order.totalAmount ?? 0, locale as Locale)}</span>
  //     ),
  //   },
  //   {
  //     header: "Date",
  //     accessorKey: "createdAt",
  //     render: (_, order: Order) => <span className={`!text-sm`}>{formatDate(order.createdAt, locale as Locale)}</span>,
  //   },
  //   {
  //     header: "Status",
  //     accessorKey: "status",
  //     render: (_, order: Order) => (
  //       <span
  //         className={cn(
  //           `rounded-full px-2 py-1 !text-sm capitalize`,
  //           order.status === "paid" && "bg-low-success text-mid-success",
  //           order.status === "unpaid" && "bg-yellow-100 text-yellow-600",
  //           order.status === "cancelled" && "bg-red-100 text-red-600",
  //           order.status === "delivered" && "bg-blue-100 text-blue-600",
  //         )}
  //       >
  //         {order.status}
  //       </span>
  //     ),
  //   },
  // ];
};

export const useProductColumn = (): TableColumnDefinition<Product>[] => {
  const locale = useLocale();

  return [
    {
      header: "IMG",
      accessorKey: "images",
      render: (_, product: Product) => (
        // <BlurImage className={`bg-muted`} width={49} height={45} src={product.images[0]} alt={product.name} />
        <div className="bg-background relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
          <div className="flex h-full items-center justify-center">
            {product.images.length > 0 ? (
              <BlurImage
                className={`bg-muted rounded-md`}
                width={50}
                height={50}
                src={product.images[0]}
                alt={product.name}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Product Name",
      accessorKey: "name",
      render: (_, product: Product) => (
        <Tooltip content={product.name}>
          <span className="block max-w-[150px] cursor-help truncate !text-sm font-medium">{product.name}</span>
        </Tooltip>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      render: (_, product: Product) => (
        <Tooltip content={product.category}>
          <span className="block max-w-[120px] cursor-help truncate !text-sm">{product.category}</span>
        </Tooltip>
      ),
    },
    {
      header: "Price",
      accessorKey: "price",
      render: (_, product: Product) => (
        <span className={`!text-sm capitalize`}>{formatCurrency(product.price, locale as Locale)}</span>
      ),
    },
    {
      header: "Stock",
      accessorKey: "stockCount",
      render: (_, product: Product) => <span className="!text-sm">{product.stockCount}</span>,
    },
    {
      header: "Date Added",
      accessorKey: "createdAt",
      render: (_, product: Product) => (
        <span className={`!text-sm capitalize`}>{formatDate(product.createdAt, locale as Locale)}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      render: (_, product: Product) => (
        <span
          className={cn(
            `rounded-full px-2 py-1 !text-sm capitalize`,
            product.status.includes(`published`) && `bg-low-success text-mid-success`,
            product.status.includes(`draft`) && `bg-yellow-100 text-yellow-600`,
          )}
        >
          {product.status}
        </span>
      ),
    },
  ];
};

export const useUserColumn = (): TableColumnDefinition<User>[] => {
  return [
    {
      header: "Name",
      accessorKey: "firstName",
      render: (_, user: User) => {
        return <span className="!text-sm">{`${user.firstName} ${user.lastName}`}</span>;
      },
    },
    {
      header: "Phone Number",
      accessorKey: "phone",
      render: (_, user: User) => <span className="!text-sm">{user.phone}</span>,
    },
    {
      header: "Email Address",
      accessorKey: "email",
      render: (_, user: User) => <span className="!text-sm">{user.email}</span>,
    },
    {
      header: "Date & Time",
      accessorKey: "id",
      render: (_, user: User) => <span className="!text-sm">{user.id}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      render: (_, user: User) => (
        <span
          className={`rounded-md px-2 py-1 !text-sm capitalize ${Math.floor(Math.random() + 1 * 2) % 2 === 0 ? "bg-green-100 text-green-800" : "bg-green-100 text-green-800"}`}
        >
          {user.status || `Completed`}
        </span>
      ),
    },
  ];
};

export const useDashboardOrderColumn = (): TableColumnDefinition<Order>[] => {
  const locale = useLocale();

  return [
    {
      header: "Reference ID",
      accessorKey: "reference",
      render: (_, order: Order) => <span className="!text-sm font-medium">{order.reference ?? "N/A"}...</span>,
    },
    {
      header: "Products",
      accessorKey: "items",
      render: (_, order: Order) => (
        <div className="flex items-center space-x-2">
          <div className="relative">
            {order.items?.[0]?.product?.images && order.items[0].product.images.length > 0 && (
              <BlurImage
                src={order.items[0].product.images[0]}
                alt={order.items[0].product.name}
                width={40}
                height={40}
                className="rounded-md object-cover"
              />
            )}
            {order.items && order.items.length > 1 && (
              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                +{order.items.length - 1}
              </div>
            )}
          </div>
          <div>
            <div className="!text-sm font-medium">{order.items?.[0]?.product?.name || "N/A"}</div>
            <div className="!text-sm text-gray-500">
              {order.items?.[0]?.quantity ?? 0} item{(order.items?.[0]?.quantity ?? 0) > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Buyer",
      accessorKey: "buyer",
      render: (_, order: Order) => (
        <div>
          <div className="!text-sm font-medium">{order.buyer?.name ?? "N/A"}</div>
        </div>
      ),
    },
    {
      header: "Delivery Address",
      accessorKey: "shippingInfo",
      render: () => (
        <div className="max-w-xs truncate">
          <span className="!text-sm">N/A</span>
        </div>
      ),
    },
    {
      header: "Total Amount",
      accessorKey: "totalAmount",
      render: (_, order: Order) => (
        <span className="!text-sm font-medium">{formatCurrency(order.totalAmount ?? 0, locale as Locale)}</span>
      ),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      render: (_, order: Order) => <span className="!text-sm">{formatDate(order.createdAt, locale as Locale)}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      render: (_, order: Order) => (
        <span
          className={cn(
            `rounded-full px-2 py-1 !text-sm capitalize`,
            order.status === "paid" && "bg-low-success text-mid-success",
            order.status === "unpaid" && "bg-yellow-100 text-yellow-600",
            order.status === "cancelled" && "bg-red-100 text-red-600",
            order.status === "delivered" && "bg-blue-100 text-blue-600",
          )}
        >
          {order.status}
        </span>
      ),
    },
  ];
};
