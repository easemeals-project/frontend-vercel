import Image from "next/image";
import Link from "next/link";
import SignInForm from "./_components/form"; // Assuming @ is an alias for src/
import conts from "@/lib/conts";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center p-8 lg:p-12 w-full">
      <div className="w-full flex flex-col gap-y-7 max-w-md">
        {/* Form Title */}
        <div>
          <h1 className="text-3xl font-bold text-center text-text1 mb-2">
            Sign in to your account
          </h1>
          {/* Bottom Link */}
          <p className="text-center flex justify-center gap-x-3 text-text2 text-sm font-medium">
            Don’t have an account?{" "}
            <Link
              href={conts.paths.signup}
              className="font-semibold text-app_primary hover:text-shadow-app_primary"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Sign In Form Client Component */}
        <SignInForm />
      </div>
    </div>
  );
}
