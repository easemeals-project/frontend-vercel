import { createServerRunner, NextServer } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";
import { cookies } from "next/headers";
import { amplifyConfig } from "@/app/_components/auth-config-export";

export const { runWithAmplifyServerContext } = createServerRunner({
  config: amplifyConfig,
});

export const cookiesClient = generateServerClientUsingCookies({
  config: amplifyConfig,
  cookies,
});

type UserSession = {
  name: string;
  email: string;
};

export async function getAuthUserServer() {
  return await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        if (!session.tokens) return;
        const { email, name } = session.tokens.idToken
          ?.payload as any as UserSession;
        const user = { email, name };
        return user;
      } catch (error) {}
    },
  });
}
