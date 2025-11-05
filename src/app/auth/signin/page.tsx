import Image from "next/image";
import Link from "next/link";
import SignInForm from "./_components/form"; // Assuming @ is an alias for src/
import conts from "@/lib/conts";

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full bg-app_bg flex flex-col items-center justify-center">
      {/* 1. Left Side (Image) */}
      {/* This panel is hidden on mobile and takes up half the screen on medium+ */}
      {/* Using Next.js Image optimization as requested. */}
      <Image
        // Using a placeholder that matches the orange theme from the image
        src="/logo.png"
        width={70}
        height={70}
        alt="A person enjoying a healthy meal"
        priority // Load this image first
        className="object-cover"
      />
      {/* You could add text over the image here if needed, e.g.: */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-12">
          <h1 className="text-white text-4xl font-bold">Welcome to Meal Ease</h1>
        </div> */}

      {/* 2. Right Side (Form) */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-12 w-full">
        <div className="w-full flex flex-col gap-y-7 max-w-md">
          {/* Logo - Styled to look more like the wordmark in the image */}
          {/* <div className="mb-10 text-center md:text-left">
            <Link
              href="/"
              className="text-3xl font-bold text-gray-900 tracking-wide"
            >
              Meal<span className="text-app_secondary">Ease</span>
            </Link>
          </div> */}

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
    </div>
  );
}
