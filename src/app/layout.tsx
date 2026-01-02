import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // Import Outfit
import "./globals.css";
import ConfigureAmplifyClientSide from "./_components/auth-config";
import { ApolloWrapper } from "../lib/apollo-wrapper";
import { safeQuery } from "@/lib/apollo-client";
import { GetFaqsResult } from "@/lib/types";
import { GET_FAQS } from "@/graphql/queries";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" }); // Configure Outfit

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
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen font-sans`}> 
        <>
          <ConfigureAmplifyClientSide />
          <ApolloWrapper>{children}</ApolloWrapper>
        </>
      </body>
    </html>
  );
}
