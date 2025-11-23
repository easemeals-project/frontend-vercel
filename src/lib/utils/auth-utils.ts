import { createServerRunner, NextServer } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { cookies } from "next/headers";
import { amplifyConfig } from "@/app/_components/auth-config-export";
import { UserRole, UserSession } from "../types";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
});

export const cookiesClient = generateServerClientUsingCookies({
  config: amplifyConfig,
  cookies,
});

export async function getAuthUserServer() {
  return await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        if (!session.tokens) return;
        const { email, name, ["custom:role"]: role } = session.tokens.idToken?.payload as any;
        const user = {email,name, role} as UserSession;
        return user;
      } catch (error) {}
    },
  });
}
