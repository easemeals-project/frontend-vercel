"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { ForgotPasswordSchema } from "@/lib/types/auth";
import { authService } from "@/core/services/auth";
import { IoArrowBack } from "react-icons/io5";
import conts from "@/lib/conts";
import Link from "next/link";

// --- Validation Schema ---

export function ForgotPasswordForm() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setAuthError(null);
      const error = await authService.resetPassword(values.email);
      // show background error
      if (error) {
        setAuthError(error);
        setTimeout(() => {
          setAuthError(null);
        }, 5000);
      } else {
        router.push(`${conts.paths.resetPassword}?email=${values.email}`);
      }
      setSubmitting(false);
    },
  });

  // --- Style to match your sign-in inputs ---
  const getInputClasses = () => {
    const baseClasses =
      "block w-full border-2 bg-transparent px-3 py-2 outline-0 transition-colors rounded-md";
    const defaultBorder = "border-gray-300";
    const errorBorder = "border-red-500";
    const focusBorder = "focus:border-orange-500";
    const ring = "focus:ring-0"; // Remove the default blue ring

    if (formik.touched.email && formik.errors.email) {
      return `${baseClasses} ${errorBorder} ${focusBorder} ${ring}`;
    }
    return `${baseClasses} ${defaultBorder} ${focusBorder} ${ring}`;
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {authError && (
        <div className="rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <p>{authError}</p>
        </div>
      )}

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
          className={getInputClasses()}
        />
        {formik.touched.email && formik.errors.email ? (
          <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
        ) : null}
      </div>

      {/* Submit Button */}
      <div className="py-3">
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="flex w-full justify-center rounded-sm cursor-pointer bg-green-400 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-green-500 disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {formik.isSubmitting ? "Sending Code..." : "Send Reset Code"}
        </button>
      </div>
      <div>
        <Link
          href={conts.paths.signin}
          className="flex gap-3 justify-center items-center text-app_primary!"
        >
          <IoArrowBack className="max-h-min" />
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
