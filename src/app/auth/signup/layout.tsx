"use client";
import { Suspense } from "react";
import RoleSelectionPage from "./_components/role";
import { useSearchParams } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  return <Suspense>{!role ? <RoleSelectionPage /> : children}</Suspense>;
}
