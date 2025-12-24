/* eslint-disable @typescript-eslint/no-explicit-any */

import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";

import {
  NewsletterService,
  type NewsletterSubscribePayload,
  type NewsletterSubscribeResponse,
} from "./newsletter.service";

export const useNewsletterService = () => {
  const { useServiceMutation } = createServiceHooks<NewsletterService>(dependencies.NEWSLETTER_SERVICE);

  const useSubscribeToNewsletter = (options?: any) =>
    useServiceMutation<NewsletterSubscribeResponse, NewsletterSubscribePayload>(
      (service, payload) => service.subscribe(payload),
      options,
    );

  return {
    useSubscribeToNewsletter,
  };
};
