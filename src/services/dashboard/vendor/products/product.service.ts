/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditProductFormData } from "@/app/[locale]/(dashboard-pages)/_components/forms/edit-product-form";
import { HttpAdapter } from "@/lib/http/http-adapter";
import { tryCatchWrapper } from "@/lib/tools/tryCatchFunction";
import { SimpleProductFormData } from "@/schemas";

import { getCurrentStoreCached } from "../store/current-store";

export class DashboardProductService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getAllProducts(filters: Filters) {
    const store = await getCurrentStoreCached(this.http);
    if (store?.success) {
      const response = await this.http.get<ProductApiResponse>(`/products`, { storeId: store.data.id, ...filters });
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to fetch products");
    }
    throw new Error("Failed to fetch products");
  }

  async getSingleProduct(id: string) {
    return tryCatchWrapper(async () => {
      const response = await this.http.get<{ success: boolean; data: Product }>(`/products/${id}`);
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error(`Failed to fetch product with ID: ${id}`);
    });
  }

  // Create product
  async createProduct(data: SimpleProductFormData, storeID: string) {
    const headers = { "Content-Type": "multipart/form-data" };

    // Create FormData for multipart upload
    const formData = new FormData();

    // Append text fields
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("category", data.category);
    formData.append("stockCount", data.stockCount.toString());
    formData.append("description", data.description);
    formData.append("storeId", storeID);
    formData.append("status", data.status || "published");
    formData.append("weight", data.weight.toString());
    formData.append("fragile", data.fragile.toString());

    if (data.discountPrice) {
      formData.append("discountPrice", data.discountPrice.toString());
    }

    // Append images (File objects)
    for (const imageObject of data.images) {
      formData.append(`images`, imageObject.file);
    }

    return tryCatchWrapper(async () => {
      const response = await this.http.post<{ success: boolean; data: Product }>(`/products`, formData, headers);
      if (response?.status === 201) {
        return response.data;
      }
      throw new Error("Failed to create product");
    });
  }

  // handle delete product and edit product

  async deleteProduct(id: string) {
    return tryCatchWrapper(async () => {
      const response = await this.http.delete<ProductApiResponse>(`/products/${id}`);
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to delete product");
    });
  }

  async editProduct(id: string, data: EditProductFormData) {
    const headers = { "Content-Type": "application/json" };

    // Create JSON payload
    const payload: Record<string, any> = {};

    // Append text fields if they exist
    if (data.name !== undefined) payload.name = data.name;
    if (data.price !== undefined) payload.price = data.price;
    if (data.stockCount !== undefined) payload.stockCount = data.stockCount;
    if (data.description !== undefined) payload.description = data.description;
    if (data.status !== undefined) payload.status = data.status;

    if (data.discountPrice !== undefined && data.discountPrice !== null) {
      payload.discountPrice = data.discountPrice;
    }

    return tryCatchWrapper(async () => {
      const response = await this.http.patch<ProductApiResponse>(`/products/${id}`, payload, headers);
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to edit product");
    });
  }

  async editProductImages(id: string, data: { image: File; url: string }) {
    const headers = { "Content-Type": "multipart/form-data" };
    const formData = new FormData();

    // Append image file and url string
    formData.append(`image`, data.image);
    formData.append(`url`, data.url);

    return tryCatchWrapper(async () => {
      const response = await this.http.patch<ProductApiResponse>(`/products/${id}/images`, formData, headers);
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to edit product images");
    });
  }

  async deleteProductImage(id: string, url: string) {
    return tryCatchWrapper(async () => {
      const response = await this.http.delete<ProductApiResponse>(`/products/${id}/images`, { url });
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to delete product image");
    });
  }

  async updateProductStatus(id: string, status: "published" | "draft") {
    return tryCatchWrapper(async () => {
      const response = await this.http.patch<ProductApiResponse>(`/products/${id}`, { status });
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to update product status");
    });
  }

  // Get current store via shared cached fetch
  async getMyStore() {
    return getCurrentStoreCached(this.http);
  }
}
