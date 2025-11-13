"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
// --- v6 IMPORTS ---
import OtpInput from "@/app/_components/global/OtpInput";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { ResetPasswordSchema } from "@/lib/types/auth";
import conts from "@/lib/conts";
import { authService } from "@/core/services/auth";
import { MsgType } from "@/lib/types";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Get email from URL ---
  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    } else {
      router.push(conts.paths.forgotPass); // No email, send them back
    }
  }, [searchParams, router]);

  const formik = useFormik({
    initialValues: {
      confirmationCode: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setAuthError(null);
      const error = await authService.confirmResetPassword(values, email);
      // show background error
      if (error) {
        setAuthError(error);
        setTimeout(() => {
          setAuthError(null);
        }, 5000);
      } else {
        router.push(`${conts.paths.signin}?msg=${MsgType.reset}`);
      }
      setSubmitting(false);
    },
  });

  // --- Style to match your sign-in inputs ---
  const getInputClasses = (
    field: "confirmationCode" | "newPassword" | "confirmNewPassword"
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
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {authError && (
        <div className="rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          <p>{authError}</p>
        </div>
      )}

      <p className="text-sm text-gray-600 text-center">
        Enter the code sent to <span className="font-medium">{email}</span>.
      </p>

      {/* Confirmation Code */}
      <div className="relative">
        <OtpInput
          value={formik.values.confirmationCode}
          onChange={(value) => formik.setFieldValue("confirmationCode", value)}
          onBlur={formik.handleBlur}
          name="confirmationCode"
          error={formik.errors.confirmationCode}
        />
      </div>

      {/* New Password */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-text2"
          >
            New Password
          </label>
        </div>
        <input
          id="newPassword"
          name="newPassword"
          type={showPassword ? "text" : "password"}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.newPassword}
          className={getInputClasses("newPassword")}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute pr-3 right-0 top-0 h-10 mt-7 flex items-center text-gray-500 cursor-pointer"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOutlined className="scale-115" />
          ) : (
            <EyeInvisibleOutlined className="scale-115" />
          )}
        </button>

        {formik.touched.newPassword && formik.errors.newPassword ? (
          <p className="mt-2 text-sm text-red-600">
            {formik.errors.newPassword}
          </p>
        ) : null}
      </div>

      {/* Confirm New Password */}
      <div className="relative">
        <label
          htmlFor="confirmNewPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm New Password
        </label>
        <input
          id="confirmNewPassword"
          name="confirmNewPassword"
          type={showConfirmPassword ? "text" : "password"}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmNewPassword}
          className={getInputClasses("confirmNewPassword")}
        />
        {formik.touched.confirmNewPassword &&
        formik.errors.confirmNewPassword ? (
          <p className="mt-2 text-sm text-red-600">
            {formik.errors.confirmNewPassword}
          </p>
        ) : null}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={formik.isSubmitting || !formik.isValid}
          className="w-full flex justify-center py-3 px-4 cursor-pointer border border-transparent rounded-lg shadow-sm text-sm font-medium text-white  focus:outline-none focus:ring-2 bg-app_primary disabled:opacity-50"
        >
          {formik.isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </form>
  );
}
