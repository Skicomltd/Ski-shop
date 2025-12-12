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
    const headers = { "Content-Type": "multipart/form-data" };

    // Create FormData for multipart upload
    const formData = new FormData();

    // Append text fields if they exist
    if (data.name !== undefined) formData.append("name", data.name);
    if (data.price !== undefined) formData.append("price", data.price.toString());
    if (data.stockCount !== undefined) formData.append("stockCount", data.stockCount.toString());
    if (data.description !== undefined) formData.append("description", data.description);
    if (data.status !== undefined) formData.append("status", data.status);
    // if (data.weight !== undefined) formData.append("weight", data.weight.toString());
    // if (data.fragile !== undefined) formData.append("fragile", data.fragile.toString());

    if (data.discountPrice !== undefined && data.discountPrice !== null) {
      formData.append("discountPrice", data.discountPrice.toString());
    }

    // Images handling for update:
    // - Append mode (original images < 5): send ONLY the new files under "images"
    // - Replace mode (original images = 5): send ONLY the new files under "images" AND a parallel "replaceIndices[]"
    if (data?.images && data.images.length > 0) {
      // collect only File entries from the mixed array
      const files: File[] = [];
      for (const entry of data.images as unknown as Array<{ file?: File }>) {
        const f = entry?.file;
        if (f instanceof File) files.push(f);
      }

      // append files to form-data
      for (const f of files) {
        formData.append("images", f);
      }

      // if replaceIndices provided, append them to satisfy backend constraint
      const indices = (data as unknown as { replaceIndices?: number[] }).replaceIndices;
      if (Array.isArray(indices) && indices.length > 0) {
        const count = Math.min(files.length, indices.length);
        for (let index = 0; index < count; index++) {
          formData.append("replaceIndices[]", String(indices[index]));
        }
      }
    }

    return tryCatchWrapper(async () => {
      const response = await this.http.patch<ProductApiResponse>(`/products/${id}`, formData, headers);
      if (response?.status === 200) {
        return response.data;
      }
      throw new Error("Failed to edit product");
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
