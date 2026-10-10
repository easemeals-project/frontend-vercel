import { createClient } from "@/lib/supabase/client";
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

class AuthService {
  private getSupabase() {
    return createClient();
  }

  signup = async (params: InferType<typeof SignUpSchema>, role: UserRole) => {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            name: params.fullName,
            role: role,
          },
        },
      });

      if (error) return error.message;
    } catch (error) {
      return getErrorMessage(error);
    }
  };

  socialSignIn = async (provider: "Google" | "Facebook" | "Apple") => {
    try {
      const supabase = this.getSupabase();
      const supabaseProvider = provider.toLowerCase() as "google" | "facebook" | "apple";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: supabaseProvider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) return error.message;
    } catch (error) {
      return getErrorMessage(error);
    }
  };

  verifySignUp = async (code: string, email: string) => {
    try {
      const supabase = this.getSupabase();
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "signup",
      });
      if (error) return error.message;
    } catch (error) {
      return getErrorMessage(error);
    }
  };

  resendSignUpCode = async (email: string) => {
    try {
      const supabase = this.getSupabase();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (error) return error.message;
    } catch (error) {
      return getErrorMessage(error);
    }
  };

  resetPassword = async (email: string) => {
    try {
      const supabase = this.getSupabase();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${conts.paths.resetPassword}`,
      });
      if (error) return error.message;
    } catch (error) {
      return getErrorMessage(error);
    }
  };

  confirmResetPassword = async (
    params: InferType<typeof ResetPasswordSchema>,
    email: string
  ) => {
    try {
      const supabase = this.getSupabase();
      const { error } = await supabase.auth.updateUser({
        password: params.newPassword,
      });
      if (error) return error.message;
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
      const supabase = this.getSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: params.email,
        password: params.password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("not confirmed") || error.message.toLowerCase().includes("email not confirmed")) {
          return {
            error: error.message,
            redirectLink: `${conts.paths.verify_email}?email=${params.email}`,
          };
        }
        return { error: error.message };
      }

      if (data.session && data.user) {
        const role = (data.user.user_metadata?.role as UserRole) || UserRole.shopper;
        return { redirectLink, role };
      }
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
    return { redirectLink };
  };

  signout = async (router?: AppRouterInstance) => {
    try {
      const supabase = this.getSupabase();
      await supabase.auth.signOut();
      localStorage.clear();
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

export const authService = new AuthService();
