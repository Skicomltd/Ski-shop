import { TERMS_AND_CONDITIONS_INTRO, TERMS_AND_CONDITIONS_META, termsandconditions } from "@/lib/constants";

import { LegalDocument } from "../_components/legal-document";

export const SectionOne = () => {
  return (
    <LegalDocument meta={TERMS_AND_CONDITIONS_META} intro={TERMS_AND_CONDITIONS_INTRO} items={termsandconditions} />
  );
};
