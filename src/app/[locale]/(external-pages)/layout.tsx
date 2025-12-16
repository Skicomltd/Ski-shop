import { Footer } from "@/components/shared/footer/footer";
import { Navbar } from "@/components/shared/navbar";
// import { SpinToWinModal } from "@/modules/play-to-win/spin-to-win-modal";
import React from "react";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <Navbar />
      <div>{children}</div>
      {/* Mount the Spin-to-Win modal globally for external/shop routes */}
      {/* <SpinToWinModal>
        <span aria-hidden="true" />
      </SpinToWinModal> */}
      <Footer />
    </section>
  );
}
