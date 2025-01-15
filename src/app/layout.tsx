import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Permissionless ",
  description:
    "Permissionless is a platform for creating and managing bounties.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-gradient-to-b from-zinc-900 to-black">
        <TRPCReactProvider>
          <Header></Header>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
