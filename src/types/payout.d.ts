/** Payout and earnings related types - Global Definitions */

declare global {
  /** Withdrawal transaction status */
  type WithdrawalStatus = "approved" | "pending" | "processing" | "failed" | "completed" | "rejected";

  /** Bank information for withdrawal */
  interface Bank {
    id: string;
    name?: string;
    firstThreeDigits?: string;
    lastThreeDigits?: string;
    accountName?: string;
    accountNumber: string;
    bankName: string;
    user: {
      id: string;
      email: string;
      fullName: string;
    };
    createdAt: string;
    updatedAt: string;
  }

  /** Withdrawal history item from earnings store */
  interface WithdrawalHistoryItem {
    id: string;
    amount: number;
    date: string;
    status: WithdrawalStatus;
    bank: Bank;

    store: {
      name: string;
    };
  }

  /** Withdrawal transaction data (legacy) */
  interface WithdrawalTransaction {
    id: string;
    amount: number;
    bankName: string;
    bankAccount: string;
    date: string;
    status: WithdrawalStatus;
    transactionId?: string;
    description?: string;
    [key: string]: unknown;
  }

  /** Earnings breakdown */
  interface EarningsData {
    totalEarnings: number;
    withdrawnEarnings: number;
    pendingEarnings: number;
    availableEarnings: number;
  }

  /** Payout service response */
  interface PayoutResponse {
    data: {
      earnings: EarningsData;
      withdrawalHistory: WithdrawalTransaction[];
      metadata: {
        total: number;
        page: number;
        limit: number;
      };
    };
  }

  /** Payout store data */
  interface PayoutStore {
    id: string;
    pending: number;
    available: number;
    withdrawn: number;
    total: number;
    history: WithdrawalHistoryItem[];
  }

  /** Payout store API response */
  interface PayoutStoreResponse {
    success: boolean;
    data: PayoutStore;
  }

  /** Payout item for list */
  interface PayoutItem {
    id: string;
    pending: number;
    available: number;
    withdrawn: number;
    total: number;
  }

  /** Payout list metadata */
  interface PayoutListMetadata {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }

  /** Payouts list API response */
  interface PayoutsListResponse {
    success: boolean;
    data: {
      items: PayoutItem[];
      metadata: PayoutListMetadata;
    };
  }

  /** Payout stats data */
  interface PayoutStats {
    withdrawn: number;
    balance: number;
    pending: number;
  }

  /** Payout stats API response */
  interface PayoutStatsResponse {
    success: boolean;
    data: PayoutStats;
  }

  /** Withdrawals by payout ID response */
  interface WithdrawalsResponse {
    success: boolean;
    data: WithdrawalHistoryItem[];
  }

  /** Campaign data */
  interface Campaign {
    id: string;
    duration: number;
    type: string;
    status: string;
    startDate: string;
    endDate: string;
    clicks: number;
    impressions: number;
    conversionRate: string;
    product: Product;
    store: Store;
    vendor: UserProfile;
  }
}

// This export is needed to make this file a module
export {};
