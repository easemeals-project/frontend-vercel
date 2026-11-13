"use client";

import { Card } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import { ConfirmSchema } from "@/lib/types/auth";
import conts from "@/lib/conts";
import { authService } from "@/core/services/auth";
import { createClient } from "@/lib/supabase/client";
import OtpInput from "@/app/_components/global/OtpInput";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [checkingLink, setCheckingLink] = useState(false);

  const redirectAfterVerify = useCallback(
    (roleOverride?: string) => {
      sessionStorage.removeItem("pending_signup");
      const role = roleOverride || localStorage.getItem("userRole");
      if (role === "vendor") {
        router.push(conts.paths.vendorOnboarding);
      } else {
        router.push(conts.paths.foodPreferences);
      }
    },
    [router]
  );

  // Check if user already verified via email link (either in another tab or on phone)
  const checkEmailLinkVerified = useCallback(
    async (isManualClick = false) => {
      if (isManualClick) {
        setCheckingLink(true);
        setAuthError(null);
      }
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          redirectAfterVerify(session.user.user_metadata?.role);
          return true;
        }

        // If they verified on another device/tab where cookies weren't shared,
        // try signing in with the pending signup credentials
        const pendingRaw = sessionStorage.getItem("pending_signup");
        if (pendingRaw) {
          const pending = JSON.parse(pendingRaw);
          if (pending?.email && pending?.password) {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: pending.email,
              password: pending.password,
            });
            if (!error && data?.session) {
              redirectAfterVerify(pending.role || data.user?.user_metadata?.role);
              return true;
            }
          }
        }

        if (isManualClick) {
          setAuthError(
            "Your email is not verified yet. Please click the verification link in your email or enter the 6-digit code."
          );
        }
      } catch {
        // Ignore background polling errors
      } finally {
        if (isManualClick) {
          setCheckingLink(false);
        }
      }
      return false;
    },
    [redirectAfterVerify]
  );

  // Get email and code from URL + poll for link verification
  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    const codeFromUrl = searchParams.get("code");

    if (emailFromUrl) {
      setEmail(emailFromUrl);

      // If 6-digit code is present, auto-populate and submit
      if (codeFromUrl && codeFromUrl.length === 6) {
        formik.setFieldValue("confirmationCode", codeFromUrl);
        setTimeout(() => {
          formik.submitForm();
        }, 500);
      } else if (codeFromUrl && codeFromUrl.length > 6) {
        // PKCE verification code from email link
        const supabase = createClient();
        supabase.auth.exchangeCodeForSession(codeFromUrl).then(({ error }) => {
          if (!error) redirectAfterVerify();
        });
      }
    } else {
      router.push(conts.paths.signup); // No email, send them back
      return;
    }

    // Listen for auth state changes across tabs
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session) {
        redirectAfterVerify(session.user?.user_metadata?.role);
      }
    });

    // Check immediately and then poll every 4 seconds in case user clicked verification link in email
    checkEmailLinkVerified(false);
    const interval = setInterval(() => {
      checkEmailLinkVerified(false);
    }, 4000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [searchParams, router, checkEmailLinkVerified, redirectAfterVerify]);

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
        redirectAfterVerify();
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
        <div className="space-y-3">
          <button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
            // Styles to match your image (light green button)
            className="flex w-full justify-center rounded-sm cursor-pointer bg-green-400 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-green-500 disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {formik.isSubmitting ? "Verifying..." : "Verify code"}
          </button>

          <button
            type="button"
            disabled={checkingLink}
            onClick={() => checkEmailLinkVerified(true)}
            className="flex w-full justify-center rounded-sm cursor-pointer border border-green-500 bg-white px-4 py-2.5 text-sm font-medium text-green-600 shadow-sm hover:bg-green-50 disabled:opacity-50"
          >
            {checkingLink
              ? "Checking verification status..."
              : "Clicked the verification link in your email? Continue"}
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
