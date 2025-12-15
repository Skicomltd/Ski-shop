/* eslint-disable @typescript-eslint/no-explicit-any */

import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";
import { BankPayoutFormData } from "@/schemas";

import { PayoutService } from "./payout.service";

// Stable default filters object to avoid object reference issues
const DEFAULT_FILTERS: Filters = { page: 1, limit: 10 };

export const usePayoutService = () => {
  const { useServiceQuery, useServiceMutation } = createServiceHooks<PayoutService>(dependencies.PAYOUT_SERVICE);

  // Query for payout store
  const useGetPayoutStore = (options?: any) =>
    useServiceQuery([...queryKeys.dashboard.payouts.store()], (service) => service.getPayoutStore(), options);

  // Query for payouts list with filters
  const useGetPayouts = (filters?: Filters, options?: any) => {
    const appliedFilters = filters ?? DEFAULT_FILTERS;

    return useServiceQuery(
      [...queryKeys.dashboard.payouts.list(appliedFilters)],
      (service) => service.getPayouts(filters), // Use original filters, let service handle defaults
      { staleTime: 0, ...options },
    );
  };

  // Admin: query withdrawals with support for status/search filters
  const useGetAdminWithdrawals = (filters?: Filters, options?: any) => {
    return useServiceQuery(
      [...queryKeys.dashboard.payouts.withdrawalHistory(filters)],
      (service) => service.getAdminWithdrawals(filters),
      options,
    );
  };

  // Query for payout stats
  // const useGetPayoutStats = (options?: any) =>
  //   useServiceQuery([...queryKeys.dashboard.payouts.stats()], (service) => service.getPayoutStats(), options);

  // Query for withdrawals by payout ID
  const useGetWithdrawalsHistory = (payoutId?: string, options?: any) =>
    useServiceQuery(
      [...queryKeys.dashboard.payouts.withdrawals(payoutId || "")],
      (service) => service.getWithdrawalsHistory(payoutId),
      options,
    );

  const useGetVendorBanks = (options?: any) =>
    useServiceQuery([...queryKeys.dashboard.payouts.banks()], (service) => service.vendorBanks(), options);

  const useUpdateBankList = () =>
    useServiceMutation((service, data: BankPayoutFormData) => service.setupBankDetails(data));

  const useInitiateWithdrawal = () =>
    useServiceMutation((service, data: { amount: string; bankId: string }) => service.initiateWithdrawal(data));

  const useInitiateWithdrawalApproval = () =>
    useServiceMutation((service, data: { decision: "approve" | "reject"; withdrawalId: string }) =>
      service.initiateWithdrawalApproval(data),
    );

  const useGetWithdrawalDetails = (withdrawalId: string, options?: any) =>
    useServiceQuery(
      [...queryKeys.dashboard.payouts.withdrawals(withdrawalId), "details"],
      (service) => service.getWithdrawalDetails(withdrawalId),
      { enabled: !!withdrawalId, ...options },
    );

  return {
    useGetPayoutStore,
    useGetPayouts,
    useGetAdminWithdrawals,
    // useGetPayoutStats,
    useGetWithdrawalsHistory,
    useGetVendorBanks,
    useUpdateBankList,
    useInitiateWithdrawal,
    useInitiateWithdrawalApproval,
    useGetWithdrawalDetails,
  };
};
