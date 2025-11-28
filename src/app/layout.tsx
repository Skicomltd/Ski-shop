import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "../styles/global.css";

import { AppThemeProvider } from "@/components/core/miscellaneous/theme-provider";
import { Toast } from "@/components/shared/Toast";
import { PageWrapper } from "@/lib/animation";
import { ReactQueryProvider } from "@/lib/react-query/query-provider";
// import { MockServiceWorkerProvider } from "@/mocks/mock-provider";
import { fontVariables } from "@/styles/font";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Ski Shop",
  description: "Shop Smart and Save More with Ski-Shop",
  verification: {
    google: "NYP_VSutVkmN6e0k7TVhVahnJ8sl1MKval_R-R8zUKU",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ng">
      <SessionProvider>
        <body className={cn("", fontVariables)}>
          <ReactQueryProvider>
            <AppThemeProvider>
              <NuqsAdapter>
                <NextTopLoader showSpinner={false} />
                <Toast />
                {/* <MockServiceWorkerProvider isEnabled={true}> */}
                <PageWrapper>{children}</PageWrapper>
                {/* </MockServiceWorkerProvider> */}
              </NuqsAdapter>
            </AppThemeProvider>
          </ReactQueryProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
