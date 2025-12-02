import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConfigureAmplifyClientSide from "./_components/auth-config";
import { ApolloWrapper } from "../lib/apollo-wrapper";
import { safeQuery } from "@/lib/apollo-client";
import { GetFaqsResult } from "@/lib/types";
import { GET_FAQS } from "@/graphql/queries";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EaseMeals",
  description: "Your personal meal planner",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const res = await safeQuery<GetFaqsResult>({ query: GET_FAQS });

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen`}>
        <>
          <ConfigureAmplifyClientSide />
          <ApolloWrapper>{children}</ApolloWrapper>
        </>
      </body>
    </html>
  );
}
