import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { cookieToInitialState } from "@alchemy/aa-alchemy/config";
import { headers } from "next/headers";
import { config } from "@/config";
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Embedded Accounts Getting Started",
  description: "Embedded Accounts Quickstart Guide",
};

// [!region root-layout]
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // hydrate the initial state on the client
  const initialState = cookieToInitialState(
    config,
    headers().get("cookie") ?? undefined,
  );

  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme>
          <Providers initialState={initialState}>{children}</Providers>
        </Theme>
      </body>
    </html>
  );
}
// [!endregion root-layout]
