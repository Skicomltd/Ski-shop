import { OnboardingHttpAdapter } from "@/lib/http/onboarding-http-adapter";
import { tryCatchWrapper } from "@/lib/tools/tryCatchFunction";
import { BankPayoutFormData, BusinessInfoFormData, StoreFormData } from "@/schemas";
import { isAxiosError } from "axios";

export class OnboardingUserService {
  private readonly http: OnboardingHttpAdapter;

  constructor() {
    this.http = new OnboardingHttpAdapter();
  }

  async resendOTP(data: { email: string }) {
    return tryCatchWrapper(
      async () => {
        const response = await this.http.patch<ShortTokenResponse>("/auth/resendotp", data);
        if (response?.status === 200) {
          return response.data;
        }
        throw new Error("Failed to resend OTP");
      },
      (error: unknown) => {
        if (isAxiosError(error)) {
          return new Error(error.response?.data?.message || "Failed to resend OTP");
        }
        return new Error("Unknown error during OTP resend");
      },
    );
  }

  async verifyOTP(data: { code: string }) {
    return tryCatchWrapper(
      async () => {
        const response = await this.http.post<ShortTokenResponse>("/auth/verifyemail", data);
        if (response?.status === 200) {
          return response.data;
        }
        throw new Error("OTP verification failed");
      },
      (error: unknown) => {
        if (isAxiosError(error)) {
          return new Error(error.response?.data?.message || "OTP verification failed");
        }
        return new Error("Unknown error during OTP verification");
      },
    );
  }

  async updateBusinessInfo(businessInfo: BusinessInfoFormData) {
    return tryCatchWrapper(async () => {
      const response = await this.http.post<ShortTokenResponse>("/auth/business", businessInfo);
      if (response?.status === 201) {
        return response.data;
      }
      throw new Error("Failed to update business info");
    });
  }

  async setupBankDetails(bankDetails: BankPayoutFormData) {
    return tryCatchWrapper(async () => {
      const response = await this.http.post<ShortTokenResponse>("/auth/bank", bankDetails);
      if (response?.status === 201) {
        return response.data;
      }
      throw new Error("Failed to update bank details");
    });
  }

  async createStore(storeData: StoreFormData) {
    const headers = { "Content-Type": "multipart/form-data" };
    return tryCatchWrapper(async () => {
      const requestData = {
        name: storeData.name,
        description: storeData.description,
        logo: storeData?.image?.[0],
        // logo: storeData?.image,
      };

      const response = await this.http.post<ShortTokenResponse>("/auth/store", requestData, headers);
      if (response?.status === 201) {
        return response.data;
      }
      throw new Error("Failed to create store");
    });
  }

  // /banks/available
  async getAvailableBanks() {
    return tryCatchWrapper(async () => {
      const response = await this.http.get<{ success: boolean; data: { name: string; code: string }[] }>(
        "/banks/available",
      );
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to get available banks");
    });
  }
}
