/**
 * Business domain types for the Ski Shop application
 */

declare global {
  /** Dashboard overview data */
  interface AdminDashboardOverview {
    commisions: number;
    subscriptions: number;
    promotionAds: number;
    totalRevenue: number;
  }

  interface AdminActiveSubscription {
    id: string;
    vendorName: string;
    startDate: string;
    endDate: string;
    planType: string;
    status: string;
    payment: object;
  }

  interface AdminSalesOverviewData {
    year: number;
    month: string;
    total: number;
  }
  interface AdminRevenueTrend {
    year: number;
    month: number;
    total: number;
  }

  interface AdminRevenueOverviewData {
    commisions: number;
    subscriptions: number;
    promotionAds: number;
    totalRevenue: number;
  }

  interface Users {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    itemsCount: number;
    ordersCount: number;
    email: string;
    isEmailVerified: boolean;
    lastTimeActivity: string;
    createdAt: string;
    phoneNumber: string;
    kycStatus?: string;
    subscriptionStatus?: string;
    status?: string;
    store: Store | null;
    [key: string]: unknown;
  }

  /** Payout stats API response */
  interface AdminPayoutStatsResponse {
    success: boolean;
    data: {
      totalPayoutsPaid: number;
      walletBalance: number;
      pendingPayouts: number;
    };
  }

  interface RevenueHistory extends DataItem {
    id: string;
    revenueSource: string;
    description: string;
    amount: number;
    user: string;
    role: string;
    date: string;
  }

  /** Payout request data */
  interface PayoutRequest extends DataItem {
    id: string;
    amount: number;
    date: string;
    status: string;
    walletBalance: number;
    bank: {
      id: string;
      name: string;
      firstThreeDigits: string;
      lastThreeDigits: string;
    };
    store: {
      name: string;
    };
    user: {
      role: "vendor" | "rider" | "admin" | "customer";
    };
    dateProccess: null;
  }

  /** Payout history data */
  interface PayoutHistory extends DataItem {
    id: string;
    userId: string;
    userName: string;
    storeName?: string;
    role: "vendor" | "rider";
    amount: number;
    dateTime: string;
    status: "completed" | "failed";
    transactionId?: string;
  }

  interface AdminSubscriptionOverviewData {
    totalSubscriptions: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
    pendingSubscriptions: number;
  }

  interface SubscriptionHistory extends DataItem {
    id: string;
    vendorName: string;
    planType: string;
    // amount: number;
    startDate: string;
    endDate: string;
    status: string;
  }

  interface AdminSubscriptionPlan {
    id: string;
    name: string;
    planCode: string;
    savingPercentage: number;
    amount: number;
    createdAt: string;
  }

  interface createSubscriptions {
    id: string;
    startDate: string;
    endDate: string;
    planType: string;
    status: string;
    payment: {
      accessCode: string;
      authorizationUrl: string;
      reference: string;
    };
  }

  interface AdminActiveSubscriptionApiResponse extends PaginatedApiResponse<AdminActiveSubscription> {}
  interface AdminSalesOverview extends ApiResponse<AdminSalesOverviewData[]> {}
  interface AdminRevenueOverview extends ApiResponse<AdminRevenueOverviewData> {}
  interface AdminSubscriptionOverview extends ApiResponse<AdminSubscriptionOverviewData> {}
  interface AdminUserApiResponse extends PaginatedApiResponse<Users> {}
  interface AdminRevenueTrend extends ApiResponse<AdminRevenueTrend[]> {}
  interface AdminRevenueHistoryApiResponse extends ApiResponse<RevenueHistory[]> {}
  interface AdminSubscriptionHistoryApiResponse extends PaginatedApiResponse<SubscriptionHistory> {}
  interface AdminPayoutRequestApiResponse extends PaginatedApiResponse<PayoutRequest> {}
  interface AdminPayoutHistoryApiResponse extends PaginatedApiResponse<PayoutHistory> {}
  interface AdminAllAvailablePlansApiResponse extends PaginatedApiResponse<AdminSubscriptionPlan[]> {}
  interface CreateSubscriptionApiResponse extends ApiResponse<CreateSubscription> {}

  // Admin Settings
  interface AdminGeneralSettings {
    id: string;
    purchaseEmailNotification: boolean;
    newsAndUpdateEmailNotification: boolean;
    productCreationEmailNotification: boolean;
    payoutEmailNotification: boolean;
    contactEmail: string;
    alternativeContactEmail: string | null;
  }

  interface AdminPlay2WinSettings {
    id: string;
    couponRedemptionFrequency: string; // e.g. "Once Every 24 Hours"
    drawCycleResetTime: string; // e.g. "08:00PM"
    loginRequiredToPlay: boolean;
    notifyAdminOnCouponExhaustion: boolean;
    playFrequency: string; // e.g. "Once Every 24 Hours"
    redemptionWindowDays: number;
    showWinnersNotification: boolean;
  }

  interface AdminPromotionSettings {
    id: string;
    autoApprovePromotions: boolean;
    bannerPromotion: boolean;
    defaultDurationDays: number;
    featuredSectionPromotion: boolean;
    maxPromotionsPerDay: number;
    notifyOnNewRequest: boolean;
    notifyVendorOnApproval: boolean;
  }

  interface AdminRevenueSettings {
    id: string;
    autoExpiryNotification: boolean;
    fulfillmentFeePercentage: number;
    gasFee: number;
    gracePeriodAfterExpiry: number;
    maxPayoutAmount: number;
    maxWithdrawalsPerDay: number;
    minPayoutAmount: number;
    monthlySubscriptionFee: number;
    notifyOnCommissionDeduction: boolean;
    notifyOnSubscriptionExpiry: boolean;
    notifyUserOnApproval: boolean;
    yearlySubscriptionFee: number;
  }

  interface AdminSettingsData {
    id: string;
    generalSettings: AdminGeneralSettings;
    play2winSettings: AdminPlay2WinSettings;
    promotionSettings: AdminPromotionSettings;
    revenueSettings: AdminRevenueSettings;
  }

  // Payload used for POST/PATCH /settings
  interface AdminSettingsPayload {
    generalSetting?: Partial<Omit<AdminGeneralSettings, "id">>;
    revenueSetting?: Partial<Omit<AdminRevenueSettings, "id">>;
    promotionSetting?: Partial<Omit<AdminPromotionSettings, "id">>;
    play2winSetting?: Partial<Omit<AdminPlay2WinSettings, "id">>;
  }

  interface AdminSettingsApiResponse extends ApiResponse<AdminSettingsData> {}
}

export {};
