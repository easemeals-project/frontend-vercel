import { Card } from "antd";
import { ResetPasswordForm } from "./_components/form";

export default function ResetPassword() {
  return (
    <div className="flex flex-col items-center justify-center p-6 lg:p-12 w-full">
      <div className="w-full flex flex-col gap-y-7 max-w-lg">
        <Card className="w-full max-w-lg rounded-lg bg-white shadow-lg sm:p-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Reset your password
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
              Enter your new password below
            </p>
          </div>

          {/* 3. Confirmation Form Client Component */}
          <div className="mt-8">
            <ResetPasswordForm />
          </div>
        </Card>
      </div>
    </div>
  );
}
