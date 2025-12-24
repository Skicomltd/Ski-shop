"use client";

import { Wrapper } from "@/components/core/layout/wrapper";

import { MobileDownloadBanner } from "../_components/mobile-download-banner";
// import { Testimonial } from "../(home)/_components/testimonial/testimonial";
import { Hero } from "./_views/Hero";
import { SectionOne } from "./_views/section-one";
import { SectionThree } from "./_views/section-three";
import { SectionTwo } from "./_views/section-two";

// import { Teams } from "./_views/teams";

const Page = () => {
  return (
    <main>
      <Hero />
      <Wrapper className={`space-y-8`}>
        <SectionOne />
        <SectionTwo />
      </Wrapper>
      <section className={``}>
        <SectionThree />
      </section>
      {/* <Teams /> */}
      {/* <Testimonial /> */}
      <MobileDownloadBanner />
    </main>
  );
};

export default Page;
