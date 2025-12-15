import { HttpAdapter } from "@/lib/http/http-adapter";
import { tryCatchWrapper } from "@/lib/tools/tryCatchFunction";
import { BankPayoutFormData } from "@/schemas";

export class PayoutService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getPayoutStore() {
    return tryCatchWrapper(async () => {
      const response = await this.http.get<PayoutStoreResponse>("/payouts/store");
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to get payout store");
    });
  }

  async getPayouts(filters?: Filters) {
    return tryCatchWrapper(async () => {
      const queryString = filters ? this.buildQueryParameters(filters) : "";
      const url = `/payouts${queryString ? `?${queryString}` : ""}`;

      const response = await this.http.get<PayoutsListResponse>(url);
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to get payouts");
    });
  }

  /**
   * Fetch withdrawals for admin views using the generic withdrawals endpoint.
   *
   * This maps to the "Find as Admin" request in the API collection
   * (e.g. GET /withdrawals?status=pending).
   */
  async getAdminWithdrawals(filters?: Filters) {
    return tryCatchWrapper(async () => {
      const queryString = filters ? this.buildQueryParameters(filters) : "";
      const url = `/withdrawals${queryString ? `?${queryString}` : ""}`;

      const response = await this.http.get<WithdrawalsResponse>(url);
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to get withdrawals");
    });
  }

  async initiateWithdrawal(data: { amount: string; bankId: string }) {
    return tryCatchWrapper(async () => {
      const response = await this.http.post<ApiResponse<WithdrawalHistoryItem>>("/withdrawals", data);
      if (response?.status === 201) {
        return response.data;
      }
      throw new Error("Failed to initiate withdrawal");
    });
  }

  async initiateWithdrawalApproval(data: { decision: "approve" | "reject"; withdrawalId: string }) {
    return tryCatchWrapper(async () => {
      const response = await this.http.post<{ success: boolean }>("/withdrawals/decision", data);
      if (response?.status === 201) {
        return response.data;
      }
      throw new Error("Failed to initiate withdrawal approval");
    });
  }

  async getWithdrawalsHistory(payoutId?: string) {
    return tryCatchWrapper(async () => {
      const response = await this.http.get<WithdrawalsResponse>(
        `/withdrawals${payoutId ? `?payoutId=${payoutId}` : ""}`,
      );
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to get withdrawals");
    });
  }

  async getWithdrawalDetails(withdrawalId: string) {
    return tryCatchWrapper(async () => {
      const response = await this.http.get<ApiResponse<WithdrawalHistoryItem>>(`/withdrawals/${withdrawalId}`);
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to get withdrawal details");
    });
  }

  async vendorBanks() {
    return tryCatchWrapper(async () => {
      const response = await this.http.get<ApiResponse<{ items: Bank[] }>>("/banks");
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to get list of banks");
    });
  }

  async setupBankDetails(bankDetails: BankPayoutFormData) {
    return tryCatchWrapper(async () => {
      const response = await this.http.post<ApiResponse<Bank>>("/banks", bankDetails);
      if (response?.status === 201) {
        return response.data;
      }
      throw new Error("Failed to update bank details");
    });
  }

  private buildQueryParameters(filters: Filters): string {
    const queryParameters = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined) {
        queryParameters.append(key, value.toString());
      }
    }
    return queryParameters.toString();
  }
}
