import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { cookies } from "next/headers";
import { amplifyConfig } from "@/app/_components/auth-config-export";
import { UserSession } from "../types";

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
        const token = session.tokens.accessToken.toString();
        const {
          email,
          name,
          ["custom:role"]: role,
        } = session.tokens.idToken?.payload as any;
        const user = { email, name, role } as UserSession;
        return { user, token };
      } catch (error) {}
    },
  });
}
