"use client";
import { Suspense } from "react";
import RoleSelectionPage from "./_components/role";
import { useSearchParams } from "next/navigation";

function SignupContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  return !role ? <RoleSelectionPage /> : <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent>{children}</SignupContent>
    </Suspense>
  );
}
