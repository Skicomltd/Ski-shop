/* eslint-disable @typescript-eslint/no-explicit-any */

import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";
import { ContactFormData } from "@/schemas";

import { ContactService, type ContactUsResponse } from "./contact.service";

export const useContactService = () => {
  const { useServiceMutation } = createServiceHooks<ContactService>(dependencies.CONTACT_SERVICE);

  const useContactUs = (options?: any) =>
    useServiceMutation<ContactUsResponse, ContactFormData>((service, data) => service.contactUs(data), options);

  return {
    useContactUs,
  };
};
