export const queryKeys = {
  product: {
    list: (filters?: Filters) => [
      "products",
      "list",
      filters?.page,
      filters?.search,
      filters?.status,
      filters?.categories,
      filters?.storeId,
      filters?.sortBy,
      filters?.rating,
      filters?.limit,
      filters?.flag, // Add flag parameter to query key
    ],
    details: (id: string) => ["products", "details", id] as const,
    categories: () => ["products", "categories"] as const,
    saved: () => ["products", "saved"] as const,
    similar: (productId: string, filters: Filters) => ["products", "similar", productId, filters] as const,
  },
  review: {
    list: (filters: Filters) => ["review", "list", filters?.productId] as const,
    details: (productId: string) => ["review", "details", productId] as const,
  },
  cart: {
    list: () => ["cart"] as const,
    item: (id: string) => ["cart", "item", id] as const,
  },
  vendor: {
    top: () => ["vendor", "top"] as const,
  },
  user: {
    list: (filters?: Filters) =>
      ["user", "list", filters?.page, filters?.search, filters?.status, filters?.role, filters?.limit] as const,
    profile: () => ["user", "profile"] as const,
    details: (id: string) => ["user", "details", id] as const,
  },
  order: {
    list: () => ["order", "list"] as const,
    details: (id: string) => ["order", "details", id] as const,
  },
  settings: {
    general: () => ["settings", "general"] as const,
    notifications: () => ["settings", "notifications"] as const,
    privacy: () => ["settings", "privacy"] as const,
    subscriptions: () => ["settings", "subscriptions"] as const,
    subscriptionOverview: () => ["settings", "subscription-overview"] as const,
    allAvailablePlans: () => ["settings", "all-available-plans"] as const,
    createSubscription: () => ["settings", "create-subscription"] as const,
    // subscriptionHistory: () => ["settings", "subscription-history"] as const,
  },
  admin: {
    settings: {
      my: () => ["admin", "settings", "my"] as const,
    },
  },
  dashboard: {
    overview: () => ["dashboard", "overview"] as const,
    products: {
      list: (filters?: Filters) => [
        "dashboard",
        "products",
        "list",
        filters?.page,
        filters?.search,
        filters?.status,
        filters?.sort,
        filters?.limit,
      ],
      details: (id: string) => ["dashboard", "products", "details", id] as const,
    },
    orders: {
      list: (filters?: Filters) => [
        "dashboard",
        "orders",
        "list",
        filters?.page,
        filters?.search,
        filters?.status,
        filters?.limit,
        filters?.deliveryStatus,
      ],
      details: (id: string) => ["dashboard", "orders", "details", id] as const,
    },
    profile: {
      details: () => ["dashboard", "profile", "details"] as const,
    },
    payouts: {
      store: () => ["dashboard", "payouts", "store"] as const,
      list: (filters?: Filters) => ["dashboard", "payouts", "list", filters?.page, filters?.limit],
      stats: () => ["dashboard", "payouts", "stats"] as const,
      withdrawalHistory: (filters?: Filters) => [
        "dashboard",
        "payouts",
        "withdrawal-history",
        filters?.page,
        filters?.limit,
      ],
      withdrawals: (payoutId: string) => ["dashboard", "payouts", "withdrawals", payoutId] as const,
      banks: () => ["dashboard", "payouts", "banks"] as const,
      campaigns: (filters?: Filters) => ["dashboard", "payouts", "campaigns", filters?.page, filters?.limit],
    },
    subscriptions: () => ["dashboard", "subscriptions"] as const,
    salesOverview: () => ["dashboard", "sales-overview"] as const,
    payoutsStats: () => ["dashboard", "payouts-stats"] as const,
    revenueOverview: () => ["dashboard", "revenue-overview"] as const,
    revenueTrend: () => ["dashboard", "revenue-trend"] as const,
    revenueHistory: () => ["dashboard", "revenue-history"] as const,
    promotions: {
      list: (filters?: Filters) =>
        ["dashboard", "promotions", "list", filters?.page, filters?.limit, filters?.search] as const,
      details: (id: string) => ["dashboard", "promotions", "details", id] as const,
      history: (filters?: Filters) =>
        [
          "dashboard",
          "promotions",
          "history",
          filters?.page,
          filters?.limit,
          filters?.search,
          filters?.status,
        ] as const,
    },
    play2win: {
      coupons: {
        list: (filters?: Filters) =>
          [
            "dashboard",
            "play2win",
            "coupons",
            "list",
            // filters?.page,
            filters?.limit,
            filters?.search,
            filters?.status,
          ] as const,
        details: (id: string) => ["dashboard", "play2win", "coupons", "details", id] as const,
      },
      winners: {
        list: (filters?: Filters) =>
          [
            "dashboard",
            "play2win",
            "winners",
            "list",
            filters?.page,
            filters?.limit,
            filters?.search,
            filters?.status,
          ] as const,
      },
    },
  },
};
