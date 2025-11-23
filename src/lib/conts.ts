import { features } from "process";

export default {
  paths: {
    signup: "/auth/signup",
    signin: "/auth/signin",
    forgotPass: "/auth/forgot_pass",
    verify_email: "/auth/verify_email",
    resetPassword: "/auth/reset_pass",
    dashboard: "/dashboard",
    role: "/auth/role",
    foodPreferences: "/dashboard/food-preferences",
    timetable: "/dashboard/timetable",
    editTimetable: "/dashboard/timetable/edit",
    schedule: "/dashboard/schedule",
    wallet: "/dashboard/wallet",
    event: "/dashboard/event",
    vendors: "/dashboard/vendors",
    profile: "/dashboard/profile",
    checkout: "/checkout",
    orderConfirmed: "/order-confirmed",
  },
  msg: {
    reset: "Your password has been changed! Please Signin.",
  },
  features: {
    socialsAuth: false,
  },
};
