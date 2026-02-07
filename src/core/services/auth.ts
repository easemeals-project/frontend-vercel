import {
  signIn,
  signUp,
  signOut,
  resendSignUpCode,
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
  signInWithRedirect,
  autoSignIn,
  fetchAuthSession,
} from "aws-amplify/auth";
import { InferType } from "yup";
import {
  ResetPasswordSchema,
  SignInSchema,
  SignUpSchema,
} from "@/lib/types/auth";
import conts from "@/lib/conts";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { getErrorMessage } from "@/lib/utils/helpers";
import { UserRole } from "@/lib/types";
// Do NOT import server-only helpers like getAuthUserServer here; this module
// is used by client components. We'll rely on client-side fetchAuthSession
// from `aws-amplify/auth` to confirm the session after `autoSignIn()`.

// --- AppSync Service ---
class AuthService {
  signup = async (params: InferType<typeof SignUpSchema>, role: UserRole) => {
    try {
      const { nextStep } = await signUp({
        username: params.email,
        password: params.password,
        options: {
          userAttributes: { name: params.fullName, "custom:role": role },
          autoSignIn: true,
        },
      });
    } catch (error) {
      return getErrorMessage(error);
    }
  };
  socialSignIn = async (provider: "Google" | "Facebook") => {
    try {
      // This redirects user to Google for authentication
      await signInWithRedirect({ provider });
    } catch (error) {
      return getErrorMessage(error);
    }
  };
  verifySignUp = async (code: string, email: string) => {
    try {
      // This redirects user to Google for authentication
      await confirmSignUp({ confirmationCode: code, username: email });
      await autoSignIn();
      // Poll for a valid client-side session using the client fetchAuthSession
      // so the redirect that happens in the UI won't hit the middleware
      // before the session cookie and tokens are available.
      const maxAttempts = 10;
      let attempt = 0;
      while (attempt < maxAttempts) {
        try {
          const session = await fetchAuthSession({ forceRefresh: false });
          if (session?.tokens) break;
        } catch (err) {
          // swallow - we'll retry
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
        attempt++;
      }
    } catch (error) {
      return getErrorMessage(error);
    }
  };
  resetPassword = async (email: string) => {
    try {
      // This redirects user to Google for authentication
      await resetPassword({ username: email });
    } catch (error) {
      return getErrorMessage(error);
    }
  };
  confirmResetPassword = async (
    params: InferType<typeof ResetPasswordSchema>,
    email: string
  ) => {
    try {
      // This redirects user to Google for authentication
      await confirmResetPassword({
        username: email,
        newPassword: params.newPassword,
        confirmationCode: params.confirmationCode,
      });
    } catch (error) {
      return getErrorMessage(error);
    }
  };
  signin = async (
    params: InferType<typeof SignInSchema>,
    router: AppRouterInstance
  ) => {
    let redirectLink = conts.paths.dashboard;
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: params.email,
        password: params.password,
      });

      if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
        await resendSignUpCode({
          username: params.email,
        });
        redirectLink = `${conts.paths.verify_email}?email=${params.email}`;
        return { redirectLink };
      }

      if (isSignedIn) {
        // Fetch session to get user attributes/role immediately
        const session = await fetchAuthSession();
        const role = session.tokens?.idToken?.payload["custom:role"] as UserRole;

        // Return role so the caller can decide where to redirect
        return { redirectLink, role };
      }
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
    return { redirectLink };
  };

  signout = async (router?: AppRouterInstance) => {
    try {
      await signOut();
      localStorage.clear(); // Clear local storage including role
      if (router) {
        router.push(conts.paths.home);
      } else {
        window.location.href = conts.paths.home;
      }
    } catch (error) {
      return getErrorMessage(error);
    }
  };
}

// --- Export a singleton instance ---
export const authService = new AuthService();
