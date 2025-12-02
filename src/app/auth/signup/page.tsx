"use client";

import Link from "next/link";
import SignInForm from "./_components/form";
import conts from "@/lib/conts";
import { Suspense } from "react";
import RoleSelectionPage from "./_components/role";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  return (
    <div className="flex flex-col items-center justify-center p-8 lg:p-12 w-full">
      {!role ? (
        <RoleSelectionPage />
      ) : (
        <div className="w-full flex flex-col gap-y-7 max-w-md">
          {/* Form Title */}
          <div>
            <h1 className="text-3xl font-bold text-center text-text1 mb-2">
              Create your account
            </h1>
            {/* Bottom Link */}
            <p className="text-center flex justify-center gap-x-3 text-text2 text-sm font-medium">
              Already have an account?{" "}
              <Link
                href={conts.paths.signin}
                className="font-semibold text-app_primary hover:text-shadow-app_primary"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Sign In Form Client Component */}
          <Suspense fallback={null}>
            <SignInForm />
          </Suspense>
        </div>
      )}
    </div>
  );
}
