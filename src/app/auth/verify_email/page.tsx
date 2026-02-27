"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
const VerifyEmailForm = dynamic(() => import("./_components/form"), {
  ssr: false,
});

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <div className="flex flex-col items-center justify-center p-6 lg:p-12 w-full">
        <div className="w-full flex flex-col gap-y-7 max-w-lg">
          <div className="w-full max-w-md rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white/50 p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Verify your email
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Enter the 6-digit code we sent to your email address.
              </p>
            </div>

            {/* 3. Confirmation Form Client Component */}
            <div className="mt-8">
              <VerifyEmailForm />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
