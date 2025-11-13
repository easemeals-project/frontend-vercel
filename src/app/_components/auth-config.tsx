"use client";
import { amplifyConfig } from "@/app/_components/auth-config-export";
import { Amplify } from "aws-amplify";

// This function is for SERVER components/middleware
// Make amplify to use cookies instead of local storage
Amplify.configure({ ...amplifyConfig }, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}
