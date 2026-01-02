/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpAdapter } from "@/lib/http/http-adapter";
import { tryCatchWrapper } from "@/lib/tools/tryCatchFunction";
import { VendorProfileFormData } from "@/schemas";

import { getCurrentStoreCached } from "../store/current-store";

export interface VendorProfileApiResponse {
  success: boolean;
  data: VendorProfile;
  message?: string;
}

export interface VendorProfileInfo {
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    createdAt: string;
  };
  business: {
    id: string;
    name: string;
    address: string;
    country: string;
    state: string;
    type: string;
    kycStatus: string;
  };
  store: {
    id: string;
    description: string;
    name: string;
    logo: string;
    isStarSeller: boolean;
  };
}

export interface VendorProfileInfoApiResponse {
  success: boolean;
  data: VendorProfileInfo;
  message?: string;
}

export class DashboardProfileService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  // get store info with /store/current
  async getVendorStore() {
    return getCurrentStoreCached(this.http);
  }

  //get vendor profile
  async getVendorProfile() {
    return tryCatchWrapper(async () => {
      const response = await this.http.get<VendorProfileApiResponse>(`/stores/current`);
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to fetch vendor profile");
    });
  }

  // get vendor profile info (user + business + store)
  async getVendorProfileInfo(userId: string) {
    return tryCatchWrapper(async () => {
      const safeUserId = encodeURIComponent(userId);
      const response = await this.http.get<VendorProfileInfoApiResponse>(`/vendors/${safeUserId}/profile`);
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to fetch vendor profile info");
    });
  }

  async updateVendorProfile(data: Partial<VendorProfileFormData>) {
    const formData = new FormData();

    // Store information (nested under store[...] per backend expectations)
    if (data.name) formData.append("store[name]", data.name);
    if (data.description) formData.append("store[description]", data.description);
    // store[type] removed

    // User/Vendor personal information
    // Backend expects user[...] fields; map from our vendor schema
    if (data.vendor?.name) formData.append("user[firstName]", data.vendor.name);
    // Optional lastName / phone if present in future forms
    if ((data as any).user?.lastName) formData.append("user[lastName]", (data as any).user.lastName);
    if ((data as any).user?.phone) formData.append("user[phone]", (data as any).user.phone);

    // Business information
    // Business fields per backend: type, businessRegNumber, country, state, address
    if (data.business?.type) formData.append("business[type]", data.business.type);
    if (data.business?.businessRegNumber)
      formData.append("business[businessRegNumber]", data.business.businessRegNumber);
    if (data.business?.country) formData.append("business[country]", data.business.country);
    if (data.business?.state) formData.append("business[state]", data.business.state);
    if (data.business?.address) formData.append("business[address]", data.business.address);

    return tryCatchWrapper(async () => {
      const response = await this.http.patch<VendorProfileApiResponse>(`/vendors/profile`, formData);
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to update vendor profile");
    });
  }

  async updateVendorLogo(logo: File) {
    const formData = new FormData();
    // Logo file should be sent directly under `logo` key
    formData.append("logo", logo, logo.name);

    return tryCatchWrapper(async () => {
      const response = await this.http.patch<VendorProfileApiResponse>(`/vendors/profile`, formData);
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to update vendor logo");
    });
  }
}
