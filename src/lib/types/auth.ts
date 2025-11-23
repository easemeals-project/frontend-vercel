import { string, object, ref, boolean } from "yup";

export const SignInSchema = object().shape({
  email: string().email("Invalid email address").required("Email is required"),
  password: string().required("Password is required"),
});

export const SignUpSchema = object().shape({
  fullName: string()
    .matches(/^\s*[\S]+(\s[\S]+)+\s*$/, "Please enter your full name.")
    .required("Please enter your full name."),
  email: string().email("Invalid email address").required("Email is required"),
  password: string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: string()
    .oneOf([ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  agreeToTerms: boolean().oneOf(
    [true],
    "You must accept the Terms of Use and Privacy Policy"
  ),
});

export const ConfirmSchema = object().shape({
  confirmationCode: string()
    .required("Verification code is required")
    .matches(/^[0-9]{6}$/, "Must be a 6-digit code"),
});

export const ForgotPasswordSchema = object().shape({
  email: string().email("Invalid email address").required("Email is required"),
});

export const ResetPasswordSchema = object().shape({
  confirmationCode: string()
    .required("Verification code is required")
    .matches(/^[0-9]{6}$/, "Must be a 6-digit code"),
  newPassword: string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmNewPassword: string()
    .oneOf([ref("newPassword")], "Passwords must match")
    .required("Confirm Password is required"),
});
