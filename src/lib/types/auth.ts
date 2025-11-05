import { string, object, ref } from "yup";

export const SignInSchema = object().shape({
  email: string().email("Invalid email address").required("Email is required"),
  password: string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
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
});
