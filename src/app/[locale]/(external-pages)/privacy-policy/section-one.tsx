import { policies, PRIVACY_POLICY_INTRO, PRIVACY_POLICY_META } from "@/lib/constants";

import { LegalDocument } from "../_components/legal-document";

export const SectionOne = () => {
  return <LegalDocument meta={PRIVACY_POLICY_META} intro={PRIVACY_POLICY_INTRO} items={policies} />;
};
