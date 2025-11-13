import { features } from "process";

export default {
  paths: {
    signup: "/auth/signup",
    signin: "/auth/signin",
    forgotPass: "/auth/forgot_pass",
    verify_email: "/auth/verify_email",
    resetPassword: "/auth/reset_pass",
    dashboard: "/dashboard",
  },
  msg: {
    reset: "Your password has been changed! Please Signin.",
    signup: "Your email has been validated! Please Signin.",
  },
  features: {
    socialsAuth: false,
  },
};
