import { Card } from "antd";
import { Suspense } from "react";
import VerifyEmailForm from "./_components/form";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <div className="flex flex-col items-center justify-center p-6 lg:p-12 w-full">
        <div className="w-full flex flex-col gap-y-7 max-w-lg">
          <Card className="w-full max-w-lg rounded-lg bg-white shadow-lg sm:p-10">
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
          </Card>
        </div>
      </div>
    </Suspense>
  );
}
