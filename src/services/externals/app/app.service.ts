import { HttpAdapter } from "@/lib/http/http-adapter";

export class AppService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getAllProducts(filters: Filters) {
    // return tryCatchWrapper(async () => {
    // const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get<ProductApiResponse>(`/products`, { status: "published", ...filters });
    if (response?.status === 200) {
      return response.data;
    }
    // throw new Error("Failed to fetch products");
    // });
  }

  async getAllhandPickedProducts(filters: Filters) {
    // return tryCatchWrapper(async () => {
    // const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get<ProductApiResponse>(`/products/hand-picked`, {
      ...filters,
    });
    if (response?.status === 200) {
      return response.data;
    }
    // throw new Error("Failed to fetch products");
    // });
  }

  async getSimilarProducts(productId: string, filters: Filters) {
    // return tryCatchWrapper(async () => {
    // const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get<ProductApiResponse>(`/products/${productId}/similar`, {
      ...filters,
    });
    if (response?.status === 200) {
      return response.data;
    }
    // throw new Error("Failed to fetch products");
    // });
  }

  async getSingleProduct(id: string) {
    // return tryCatchWrapper(async () => {
    const response = await this.http.get<{ success: boolean; data: Product }>(`/products/${id}`);
    if (response?.status === 200) {
      return response.data;
    }
    //   throw new Error(`Failed to fetch product with ID: ${id}`);
    // });
  }

  async getAllProductCategory() {
    // return tryCatchWrapper(async () => {
    const response = await this.http.get<{ data: string[] }>("/products/categories");
    if (response?.status === 200) {
      return response.data;
    }
    //   throw new Error("Failed to fetch product categories");
    // });
  }

  async addToCart(data: { productId: string; quantity: number }) {
    // return tryCatchWrapper(async () => {
    const response = await this.http.post<CartApiResponse>("/carts", data);
    if (response?.status === 201) {
      return response.data;
    }
    //   throw new Error("Failed to add item to cart");
    // });
  }

  async getCart() {
    // return tryCatchWrapper(async () => {
    const response = await this.http.get<CartApiResponse>("/carts");
    if (response?.status === 200) {
      return response.data || { items: [], metadata: { total: 0 } };
    }
    //   throw new Error("Failed to fetch cart");
    // });
  }

  async getCartById(id: string) {
    // return tryCatchWrapper(async () => {
    const response = await this.http.get<CartItemApiResponse>(`/carts/${id}`);

    if (response?.status === 200) {
      return response.data;
    }
    //   throw new Error("Failed to fetch cart item");
    // });
  }

  async updateCartItem(data: { itemId: string; quantity: number }) {
    // return tryCatchWrapper(async () => {
    const response = await this.http.patch<CartApiResponse>(`/carts/${data.itemId}`, {
      quantity: data.quantity,
    });

    if (response?.status === 200) {
      return response.data;
    }
    //   throw new Error("Failed to update cart item");
    // });
  }

  async removeFromCart(itemId: string) {
    // return tryCatchWrapper(async () => {
    const response = await this.http.delete<CartApiResponse>(`/carts/${itemId}`);

    if (response?.status === 200) {
      return response.data;
    }
    //   throw new Error("Failed to remove item from cart");
    // });
  }

  async checkoutCart() {
    // return tryCatchWrapper(async () => {
    const response = await this.http.post<CheckoutApiResponse>("/carts/checkout", {
      paymentMethod: "paystack",
    });

    if (response?.status === 201) {
      return response.data;
    }
    //   throw new Error("Failed to checkout cart");
    // });
  }

  async order() {
    // return tryCatchWrapper(async () => {
    const response = await this.http.get<OrderApiResponse>("/orders");

    if (response?.status === 200) {
      return response.data;
    }
    //   throw new Error("Failed to fetch orders");
    // });
  }

  async getOrderById(id: string) {
    // return tryCatchWrapper(async () => {
    const response = await this.http.get<{ success: boolean; data: Order }>(`/orders/${id}`);

    if (response?.status === 200) {
      return response.data;
    }
    //   throw new Error(`Failed to fetch order with ID: ${id}`);
    // });
  }

  async saveProduct(data: { productId: string }) {
    // return tryCatchWrapper(async () => {
    const response = await this.http.post<Product>(`/products/saves`, data);
    if (response?.status === 201) {
      return response.data;
    }
    //   throw new Error("Failed to save product");
    // });
  }

  async removeFromFavorites(productId: string) {
    // return tryCatchWrapper(async () => {
    const response = await this.http.delete<Product>(`/products/saves/${productId}`);
    if (response?.status === 200) {
      return response.data;
    }
    //   throw new Error("Failed to remove product from favorites");
    // });
  }

  async getSavedProducts() {
    // return tryCatchWrapper(async () => {
    const response = await this.http.get<ProductApiResponse>("/products/saves");
    if (response?.status === 200) {
      return response.data;
    }
    //   throw new Error("Failed to fetch saved products");
    // });
  }

  //top venore
  async getTopVendors() {
    // return tryCatchWrapper(async () => {
    const response = await this.http.get<VendorApiResponse>("/stores?flag=top");
    if (response?.status === 200) {
      return response.data;
    }
    //   throw new Error("Failed to fetch top vendors");
    // });
  }

  async reviewProduct(data: { productId: string; comment: string; rating: number }) {
    // return tryCatchWrapper(async () => {
    const response = await this.http.post<{ success: boolean; data: Review }>("/reviews", data);
    if (response?.status === 201) {
      return response.data;
    }
    //   throw new Error("Failed to review product");
    // });
  }

  async getReviewByProductId(productId: string) {
    // return tryCatchWrapper(async () => {
    const response = await this.http.get<{ success: boolean; data: Review }>(`/reviews/${productId}`);
    if (response?.status === 200) {
      return response.data;
    }
    //   throw new Error("Failed to fetch reviews");
    // });
  }

  async getAllReviews(filters: Filters) {
    // return tryCatchWrapper(async () => {
    const response = await this.http.get<ReviewApiResponse>("/reviews", {
      ...filters,
    });
    if (response?.status === 200) {
      return response.data;
    }
    //   throw new Error("Failed to fetch reviews");
    // });
  }

  async deleteReview(reviewId: string) {
    // return tryCatchWrapper(async () => {
    const response = await this.http.delete<{ success: boolean; data: 1 | 0 }>(`/reviews/${reviewId}`);
    if (response?.status === 200) {
      return response.data;
    }
    //   throw new Error("Failed to delete review");
    // });
  }
}
