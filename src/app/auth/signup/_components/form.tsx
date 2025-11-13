"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"; // Using antd icons as requested
import { FcGoogle } from "react-icons/fc";
import { Card } from "antd";
import { SignUpSchema } from "@/lib/types/auth";
import { InferType } from "yup";
import { authService } from "@/core/services/auth";
import { useRouter } from "next/navigation";
import conts from "@/lib/conts";

// 2. --- Form Component ---
export default function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSocials = async (providers: "Google" | "Facebook") => {
    setAuthError(null);
    const error = await authService.socialSignIn(providers);
    // show background error
    if (error) {
      setAuthError(error);
      return;
    }
    router.push(conts.paths.dashboard);
  };

  // 3. --- Formik Hook ---
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    } as InferType<typeof SignUpSchema>,
    validationSchema: SignUpSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const error = await authService.signup(values);
      // show background error
      if (error) {
        setAuthError(error);
        setTimeout(() => {
          setAuthError(null);
        }, 5000);
      } else {
        router.push(`${conts.paths.verify_email}?email=${values.email}`);
      }
      setSubmitting(false);
    },
  });

  // --- Helper function to get input classes ---
  // This will make it easier to manage the underline style
  const getInputClasses = (
    field: "email" | "password" | "fullName" | "confirmPassword"
  ) => {
    const baseClasses =
      "block w-full border-2 bg-transparent px-3 py-2 outline-0 transition-colors rounded-md";
    const defaultBorder = "border-gray-300";
    const errorBorder = "border-red-500";
    const focusBorder = "focus:border-orange-500";
    const ring = "focus:ring-0"; // Remove the default blue ring

    if (formik.touched[field] && formik.errors[field]) {
      return `${baseClasses} ${errorBorder} ${focusBorder} ${ring}`;
    }
    return `${baseClasses} ${defaultBorder} ${focusBorder} ${ring}`;
  };

  return (
    <Card>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {authError && (
          <div className="rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            <p>{authError}</p>
          </div>
        )}
        {/* Full Name Field */}
        <div className="relative">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-text2 mb-2"
          >
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.fullName}
            placeholder="John Doe"
            className={getInputClasses("fullName")}
          />
          {formik.touched.fullName && formik.errors.fullName ? (
            <p className="mt-2 text-sm text-red-600">
              {formik.errors.fullName}
            </p>
          ) : null}
        </div>

        {/* Email Field */}
        <div className="relative">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text2 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            placeholder="john.doe@example.com"
            // --- Applying the new underline style ---
            className={getInputClasses("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
          ) : null}
        </div>

        {/* Password Field */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text2"
            >
              Password
            </label>
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            placeholder="Enter your password"
            // --- Applying the new underline style ---
            className={getInputClasses("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            // Position the icon correctly above the bottom border
            className="absolute pr-3 right-0 top-0 h-10 mt-7 flex items-center text-gray-500 cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOutlined className="scale-115" />
            ) : (
              <EyeInvisibleOutlined className="scale-115" />
            )}
          </button>
          {formik.touched.password && formik.errors.password ? (
            <p className="mt-2 text-sm text-red-600">
              {formik.errors.password}
            </p>
          ) : null}
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-text2"
            >
              Confirm Password
            </label>
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            placeholder="Confirm your password"
            className={getInputClasses("confirmPassword")}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <p className="mt-2 text-sm text-red-600">
              {formik.errors.confirmPassword}
            </p>
          ) : null}
        </div>

        {/* Agree to Terms */}
        <div className="flex items-center">
          <input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            checked={formik.values.agreeToTerms}
            className="h-4 w-4 !text-app_primary focus:!text-app_primary cursor-pointer border-gray-300 rounded"
          />
          <label
            htmlFor="agreeToTerms"
            className="ml-2 block text-sm text-gray-900"
          >
            I agree to the{" "}
            <a
              href="/terms"
              className="font-medium !text-app_primary hover:text-orange-500"
            >
              Terms of Use
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="font-medium !text-app_primary hover:text-orange-500"
            >
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={
              !formik.isValid ||
              !formik.values.agreeToTerms ||
              formik.isSubmitting
            }
            className={`w-full flex justify-center py-3 mt-7 ${
              formik.isValid && formik.values.agreeToTerms
                ? "cursor-pointer"
                : "cursor-not-allowed"
            } px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-app_primary hover:bg-app_secondar-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app_primary-600 disabled:opacity-50`}
          >
            {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </div>

        {conts.features.socialsAuth && (
          <>
            {/* Divider */}
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-4 text-gray-400">
                Or continue with
              </span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>

            {/* Google Sign In Button */}
            <div>
              <button
                type="button"
                onClick={() => handleSocials("Google")}
                className="w-full cursor-pointer flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FcGoogle className="mr-4 scale-150" />
                Sign up with Google
              </button>
            </div>
          </>
        )}
      </form>
    </Card>
  );
}
