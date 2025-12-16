import { HttpAdapter } from "@/lib/http/http-adapter";
import { tryCatchWrapper } from "@/lib/tools/tryCatchFunction";

export class SettingsService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getSubscriptions(filters: Filters) {
    return tryCatchWrapper(async () => {
      const response = await this.http.get<AdminSubscriptionHistoryApiResponse>(`/subscriptions`, { ...filters });

      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to get subscriptions");
    });
  }

  async createSubscriptions(data: { amount: number; planCode: string; planType: string }) {
    return tryCatchWrapper(async () => {
      const response = await this.http.post<CreateSubscriptionApiResponse>(`/subscriptions`, data);
      if (response?.status === 201) {
        return response.data;
      }
      throw new Error("Failed to create subscription");
    });
  }

  async getSubscriptionOverview() {
    return tryCatchWrapper(async () => {
      const response = await this.http.get<AdminSubscriptionOverview>("/subscriptions/overview");

      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to get subscription overview");
    });
  }

  async getAllAvailablePlans() {
    return tryCatchWrapper(async () => {
      const response = await this.http.get<AdminAllAvailablePlansApiResponse>("/plans");

      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to get all available plans");
    });
  }

  async createPlan(data: { amount: number; name: string; interval: string; savingPercentage: number }) {
    return tryCatchWrapper(async () => {
      const response = await this.http.post(`/plans`, data);

      if (response?.status === 201) {
        return response.data;
      }

      throw new Error("Failed to create subscription plan");
    });
  }
}
