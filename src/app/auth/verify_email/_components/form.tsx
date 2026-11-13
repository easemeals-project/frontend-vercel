"use client";

import { Card } from "antd";
import { MailOutlined, CheckCircleOutlined, LoginOutlined } from "@ant-design/icons";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import conts from "@/lib/conts";
import { authService } from "@/core/services/auth";
import { createClient } from "@/lib/supabase/client";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [checkingLink, setCheckingLink] = useState(false);
  const [resending, setResending] = useState(false);

  const markVerified = useCallback(async () => {
    sessionStorage.removeItem("pending_signup");
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore signOut errors
    }
    setIsVerified(true);
  }, []);

  // Check if user already verified via email link (either in another tab or on phone)
  const checkEmailLinkVerified = useCallback(
    async (isManualClick = false) => {
      if (isManualClick) {
        setCheckingLink(true);
        setAuthError(null);
        setMsg(null);
      }
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          await markVerified();
          return true;
        }

        // If they verified on another device/tab where cookies weren't shared,
        // test signing in using the pending signup credentials stored during signup
        const pendingRaw = sessionStorage.getItem("pending_signup");
        if (pendingRaw) {
          const pending = JSON.parse(pendingRaw);
          if (pending?.email && pending?.password) {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: pending.email,
              password: pending.password,
            });
            if (!error && data?.session) {
              await markVerified();
              return true;
            }
          }
        }

        if (isManualClick) {
          setAuthError(
            "Email verification not detected yet. Please click the verification link sent to your inbox first, then click Continue."
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
    [markVerified]
  );

  // Get email, verified flag, and code from URL + poll for link verification
  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    const codeFromUrl = searchParams.get("code");
    const verifiedFromUrl = searchParams.get("verified");

    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }

    if (verifiedFromUrl === "true") {
      markVerified();
      return;
    }

    if (codeFromUrl) {
      const supabase = createClient();
      supabase.auth.exchangeCodeForSession(codeFromUrl).then(() => {
        markVerified();
      });
      return;
    }

    if (!emailFromUrl) {
      router.push(conts.paths.signup);
      return;
    }

    // Listen for auth state changes across tabs
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session) {
        markVerified();
      }
    });

    // Check immediately and then poll every 3 seconds
    checkEmailLinkVerified(false);
    const interval = setInterval(() => {
      checkEmailLinkVerified(false);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [searchParams, router, checkEmailLinkVerified, markVerified]);

  const handleResendLink = async () => {
    setMsg(null);
    setAuthError(null);
    setResending(true);
    try {
      const err = await authService.resendSignUpCode(email);
      if (err) {
        setAuthError(err);
      } else {
        setMsg("Verification link has been resent to your email!");
      }
    } catch {
      setAuthError("Error resending verification link.");
    } finally {
      setResending(false);
    }

    setTimeout(() => {
      setMsg(null);
      setAuthError(null);
    }, 5000);
  };

  if (isVerified) {
    return (
      <Card className="border-0 shadow-none bg-transparent">
        <div className="space-y-6 text-center">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-green-50/80 border border-green-200 p-8 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl shadow-sm">
              <CheckCircleOutlined />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Verification Successful!
            </h1>
            <p className="text-sm text-gray-600 max-w-xs">
              Your email address has been verified and your account is now active. You can now sign in to continue.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push(conts.paths.signin)}
            className="flex w-full items-center justify-center gap-2 rounded-lg cursor-pointer bg-app_primary px-4 py-3 text-base font-medium text-white shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
          >
            <LoginOutlined />
            Return to Login Now
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Verify your email
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          We sent a verification link to your email address. Click the link in your inbox to activate your account.
        </p>
      </div>

      <div className="space-y-6">
        {authError && (
          <div className="rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700 text-sm">
            <p>{authError}</p>
          </div>
        )}
        {msg && (
          <div className="rounded-md border border-green-400 bg-green-100 px-4 py-3 text-green-700 text-sm">
            <p>{msg}</p>
          </div>
        )}

        {/* Email Info Box */}
        <div className="flex flex-col items-center justify-center rounded-2xl bg-green-50/80 border border-green-200 p-6 text-center space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 text-2xl">
            <MailOutlined />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Verification link sent to:
            </p>
            <p className="text-base font-bold text-gray-900 break-all">
              {email}
            </p>
          </div>
          <p className="text-xs text-gray-500 max-w-xs">
            Open your email and click the verification link. This page will automatically update once verified, or you can click <strong>Continue</strong> below.
          </p>
        </div>

        {/* Primary Continue Button */}
        <div>
          <button
            type="button"
            disabled={checkingLink}
            onClick={() => checkEmailLinkVerified(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg cursor-pointer bg-app_primary px-4 py-3 text-base font-medium text-white shadow-sm hover:opacity-95 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
          >
            <CheckCircleOutlined />
            {checkingLink ? "Checking Verification..." : "I've Verified My Email — Continue"}
          </button>
        </div>

        {/* Resend Link & Back to Sign In */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">
            Didn&apos;t receive the email?{" "}
            <button
              type="button"
              disabled={resending}
              onClick={handleResendLink}
              className="font-semibold text-green-600 cursor-pointer hover:text-green-500 disabled:opacity-50"
            >
              {resending ? "Sending..." : "Resend verification link"}
            </button>
          </p>
          <p className="text-xs text-gray-500">
            Already verified?{" "}
            <Link
              href={conts.paths.signin}
              className="font-medium text-app_primary hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </Card>
  );
}
