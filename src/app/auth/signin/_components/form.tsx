"use client";

import { useFormik } from "formik";
import Link from "next/link";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"; // Using antd icons as requested
import { FcGoogle } from "react-icons/fc";
import { SignInSchema } from "@/lib/types/auth";
import conts from "@/lib/conts";
import { authService } from "@/core/services/auth";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MsgType,
  RegisterUserResult,
  RegisterUserVariables,
} from "@/lib/types";
import { fetchUserAttributes } from "aws-amplify/auth";
import { useMutation } from "@apollo/client/react";
import { REGISTER_USER } from "@/graphql/mutations";

// 2. --- Form Component ---
export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [registerUser] = useMutation<RegisterUserResult, RegisterUserVariables>(
    REGISTER_USER
  );

  // Get email from URL
  useEffect(() => {
    const msgType = searchParams.get("msg");
    if (msgType) {
      if (msgType == MsgType.reset) {
        setMsg(conts.msg.reset);
      }
      setTimeout(() => {
        setMsg(null);
      }, 5000);
    }
  }, []);

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
      email: "",
      password: "",
    },
    validationSchema: SignInSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setAuthError(null);
      const result = await authService.signin(values, router);

      if (result.error) {
        setAuthError(result.error);
        setTimeout(() => {
          setAuthError(null);
        }, 5000);
      } else if (result.redirectLink) {
        if (!result.redirectLink.includes("verify-email")) {
          try {
            const attributes = await fetchUserAttributes();
            const name = attributes.name;
            const role = attributes["custom:role"];

            if (name && role) {
              await registerUser({
                variables: { name, role },
              });
            }
          } catch (e) {
            console.error("Failed to register user in DB", e);
          }
        }
        router.push(result.redirectLink);
      }
      setSubmitting(false);
    },
  });

  // --- Helper function to get input classes ---
  // This will make it easier to manage the underline style
  const getInputClasses = (field: "email" | "password") => {
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
    <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/50">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {authError && (
          <div className="rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            <p>{authError}</p>
          </div>
        )}
        {msg && (
          <div className="rounded-md border border-green-400 bg-green-100 px-4 py-3 text-green-700">
            <p>{msg}</p>
          </div>
        )}

        {/* Email Field */}
        <div className="relative">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text2 mb-2"
          >
            Email address
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
          {/* Using antd icon as requested */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            // Position the icon correctly above the bottom border
            className="absolute inset-y-0 right-0 top-auto flex items-center pr-3 h-10 text-gray-500 cursor-pointer"
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
        <div className="flex items-center justify-between mb-2">
          <Link
            href={conts.paths.forgotPass} // Dummy link
            className="text-sm font-medium text-app_primary! ml-auto"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        {/* This style should be a very close match to the image */}
        <div>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full flex justify-center py-3 mt-7 ${formik.isValid ? "cursor-pointer" : "cursor-not-allowed"
              } px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-app_primary hover:bg-app_secondar-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app_primary-600 disabled:opacity-50`}
          >
            {formik.isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </div>

        {conts.features.socialsAuth && (
          <>
            {/* Divider */}
            <div className="relative flex items-center">
              <div className="grow border-t border-gray-400"></div>
              <span className="shrink mx-4 text-gray-400">
                Or continue with
              </span>
              <div className="grow border-t border-gray-400"></div>
            </div>

            {/* Google Sign In Button */}
            <div>
              <button
                type="button"
                onClick={() => handleSocials("Google")} // This would be the handler
                className="w-full cursor-pointer flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FcGoogle className="mr-4 scale-150" />
                Sign in with Google
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
