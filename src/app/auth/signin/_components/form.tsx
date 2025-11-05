"use client";

import { useState } from "react";
import { useFormik } from "formik";
import Link from "next/link";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"; // Using antd icons as requested
import { FcGoogle } from "react-icons/fc";
import { SignInSchema } from "@/lib/types/auth";
import { Card } from "antd";
import conts from "@/lib/conts";

// 2. --- Form Component ---
export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  // 3. --- Formik Hook ---
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: SignInSchema,
    onSubmit: (values, { setSubmitting }) => {
      console.log("Form values:", values);
      // Replace with your actual API call
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 1000);
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
    <Card>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
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
            <Link
              href={conts.paths.forgotPass} // Dummy link
              className="text-sm font-medium !text-app_primary"
            >
              Forgot Password?
            </Link>
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

        {/* Submit Button */}
        {/* This style should be a very close match to the image */}
        <div>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className={`w-full flex justify-center py-3 mt-7 ${
              formik.isValid ? "cursor-pointer" : "cursor-not-allowed"
            } px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-app_primary hover:bg-app_secondar-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app_primary-600 disabled:opacity-50`}
          >
            {formik.isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </div>

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
            // onClick={handleGoogleSignIn} // This would be the handler
            className="w-full cursor-pointer flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FcGoogle className="mr-4 scale-150" />
            Sign in with Google
          </button>
        </div>
      </form>
    </Card>
  );
}
