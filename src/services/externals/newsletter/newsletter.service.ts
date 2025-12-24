import { HttpAdapter } from "@/lib/http/http-adapter";

export type NewsletterSubscribePayload = {
  email: string;
};

export type NewsletterSubscribeResponse = {
  success: boolean;
  message?: string;
  data?: unknown;
};

export class NewsletterService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  /**
   * Subscribe a user to the newsletter.
   *
   * NOTE: If your backend uses a different endpoint, update NEWSLETTER_ENDPOINT.
   */
  async subscribe(payload: NewsletterSubscribePayload) {
    const NEWSLETTER_ENDPOINT = "/newsletter";

    const response = await this.http.post<NewsletterSubscribeResponse>(NEWSLETTER_ENDPOINT, payload);

    if (response?.status === 200 || response?.status === 201) {
      return response.data;
    }

    throw new Error("Failed to subscribe to newsletter");
  }
}
