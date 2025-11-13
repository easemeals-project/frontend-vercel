import { ForgotPasswordForm } from "./_components/form";
import { Card } from "antd";

export default function InitForgotPass() {
  return (
    <div className="flex flex-col items-center justify-center p-6 lg:p-12 w-full">
      <div className="w-full flex flex-col gap-y-7 max-w-lg">
        <Card className="w-full max-w-lg rounded-lg bg-white shadow-lg sm:p-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Forgot your password?
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {/* 3. Confirmation Form Client Component */}
          <div className="mt-8">
            <ForgotPasswordForm />
          </div>
        </Card>
      </div>
    </div>
  );
}
