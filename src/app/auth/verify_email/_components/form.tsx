"use client";

import { Card } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import { ConfirmSchema } from "@/lib/types/auth";
import conts from "@/lib/conts";
import { authService } from "@/core/services/auth";
import OtpInput from "@/app/_components/global/OtpInput";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // Get email and code from URL
  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    const codeFromUrl = searchParams.get("code");

    if (emailFromUrl) {
      setEmail(emailFromUrl);

      // If code is present, auto-populate and submit
      if (codeFromUrl && codeFromUrl.length === 6) {
        formik.setFieldValue("confirmationCode", codeFromUrl);
        // We trigger submit in the next tick to ensure state is updated
        setTimeout(() => {
          formik.submitForm();
        }, 500);
      }
    } else {
      router.push(conts.paths.signup); // No email, send them back
    }
  }, [searchParams, router]);

  const formik = useFormik({
    initialValues: {
      confirmationCode: "", // This will be updated by our OTP inputs
    },
    validationSchema: ConfirmSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const error = await authService.verifySignUp(
        values.confirmationCode,
        email
      );
      // show background error
      if (error) {
        setAuthError(error);
        setTimeout(() => {
          setAuthError(null);
        }, 5000);
        setSubmitting(false);
      } else {
        // Wait for authService.verifySignUp to confirm the session is present
        // (it polls fetchAuthSession), then push to the appropriate route.
        const role = localStorage.getItem("userRole"); // Assuming role is stored in localStorage during signup/login

        if (role === "vendor") {
          router.push(conts.paths.vendorOnboarding);
        } else {
          router.push(conts.paths.foodPreferences);
        }
      }
    },
  });

  // ------------------------------------------

  const handleResendCode = async () => {
    setMsg(null);
    setAuthError(null);
    try {
      await authService.resendSignUpCode(email);
      setMsg("Code has been resent");
    } catch (error: any) {
      setAuthError("Error resending code.");
    }

    setTimeout(() => {
      setMsg(null);
      setAuthError(null);
    }, 5000);
  };

  return (
    <Card>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
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

        <OtpInput
          value={formik.values.confirmationCode}
          onChange={(value) => formik.setFieldValue("confirmationCode", value)}
          onBlur={formik.handleBlur}
          name="confirmationCode"
          error={formik.errors.confirmationCode}
        />

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
            // Styles to match your image (light green button)
            className="flex w-full justify-center rounded-sm cursor-pointer bg-green-400 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-green-500 disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {formik.isSubmitting ? "Verifying..." : "Verify code"}
          </button>
        </div>

        {/* Resend Code Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              // Style to match your image (green link)
              className="font-medium text-green-600 cursor-pointer hover:text-green-500"
            >
              Resend code
            </button>
          </p>
        </div>
      </form>
    </Card>
  );
}
