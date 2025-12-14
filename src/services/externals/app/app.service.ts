/* eslint-disable @typescript-eslint/no-explicit-any */
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

  async checkoutCart(payload: {
    paymentMethod: "paystack" | "paymentOnDelivery";
    shippingFee: number;
    shippingAddress?: {
      address: string;
      email?: string;
      name: string;
      phoneNumber: string;
      state: string;
    };
    voucherId?: string;
  }) {
    // return tryCatchWrapper(async () => {
    const response = await this.http.post<CheckoutApiResponse>("/carts/checkout", payload);

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

  async completeOrderPayment(orderId: string) {
    const response = await this.http.get<OrderApiResponse>(`/orders/${orderId}/pay`);
    if (response?.status === 200) {
      return response.data;
    }
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

  // Delivery info
  async getDeliveryInfo(payload: { dropOffState: string }) {
    const response = await this.http.post<
      ApiResponse<{
        cost: number;
        minDate: string;
        maxDate: string;
      }>
    >("/carts/delivery-info", payload);
    if (response?.status === 200 || response?.status === 201) {
      return response.data;
    }
  }

  async getDeliveryStates() {
    const response = await this.http.get<ApiResponse<string[]>>("/orders/delivery-states");
    if (response?.status === 200) {
      return response.data;
    }
  }

  // Addresses (Door Delivery) CRUD
  async createAddress(payload: {
    name: string;
    address: string;
    city: string;
    state: string;
    phoneNumber: string;
    default?: boolean;
  }) {
    const response = await this.http.post<ApiResponse<any>>("/addresses", payload);
    if (response?.status === 201 || response?.status === 200) {
      return response.data;
    }
  }

  async getAddresses() {
    const response = await this.http.get<ApiResponse<any[]>>("/addresses");
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getAddressById(id: string) {
    const response = await this.http.get<ApiResponse<any>>(`/addresses/${id}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async updateAddress(
    id: string,
    payload: Partial<{
      receiverName: string;
      streetAddress: string;
      townCity: string;
      state: string;
      phone: string;
      isDefault: boolean;
    }>,
  ) {
    const response = await this.http.patch<ApiResponse<any>>(`/addresses/${id}`, payload);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async deleteAddress(id: string) {
    const response = await this.http.delete<ApiResponse<{ success: boolean }>>(`/addresses/${id}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  // Pickup Stations CRUD
  async createPickupStation(payload: {
    state: string;
    lga?: string;
    station: string;
    place: string;
    address: string;
    price: number;
  }) {
    const response = await this.http.post<ApiResponse<any>>("/pickups", payload);
    if (response?.status === 201 || response?.status === 200) {
      return response.data;
    }
  }

  async getPickupStations() {
    const response = await this.http.get<ApiResponse<any[]>>("/pickups");
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getPickupStationById(id: string) {
    const response = await this.http.get<ApiResponse<any>>(`/pickups/${id}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async updatePickupStation(
    id: string,
    payload: Partial<{
      state: string;
      lga?: string;
      station: string;
      place: string;
      address: string;
      price: number;
    }>,
  ) {
    const response = await this.http.patch<ApiResponse<any>>(`/pickups/${id}`, payload);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async deletePickupStation(id: string) {
    const response = await this.http.delete<ApiResponse<{ success: boolean }>>(`/pickup-stations/${id}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  // Track Order
  async getTrackOrderById(orderId: string, itemId: string) {
    const path = `/orders/${orderId}/items/${itemId}`;

    const response = await this.http.get<ApiResponse<TrackOrderData>>(path);
    if (response?.status === 200) {
      return response.data;
    }
  }
}
