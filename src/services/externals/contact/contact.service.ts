import { HttpAdapter } from "@/lib/http/http-adapter";
import { ContactFormData } from "@/schemas";

export type ContactUsResponse = {
  success: boolean;
  data?: unknown;
  message?: string;
};

export class ContactService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async contactUs(payload: ContactFormData) {
    const response = await this.http.post<ContactUsResponse>("/contactUs", payload);

    if (response?.status === 200 || response?.status === 201) {
      return response.data;
    }

    throw new Error("Failed to send message");
  }
}
