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
      }
    } catch (error) {
      return getErrorMessage(error);
    }
    router.push(redirectLink);
  };
  signout = async (params: string) => {
    try {
      await signOut();
    } catch (error) {
      return getErrorMessage(error);
    }
  };
}

// --- Export a singleton instance ---
export const authService = new AuthService();
