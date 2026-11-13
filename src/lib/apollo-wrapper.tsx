"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HttpLink } from "@apollo/client";
import { ConfigProvider } from 'antd';
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { SetContextLink } from "@apollo/client/link/context";
import { createClient } from "./supabase/client";
import conts from "./conts";

function makeClient() {
  const httpLink = new HttpLink({
    uri: conts.paths.server,
    credentials: "include",
    fetchOptions: { cache: "no-store" },
  });

  const authLink = new SetContextLink(async (prevContext) => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    return {
      headers: {
        ...prevContext.headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash || !hash.includes("access_token=")) return;

    const hashParams = new URLSearchParams(hash.substring(1));
    const type = hashParams.get("type");
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) return;
      if (type === "recovery") {
        router.replace(conts.paths.resetPassword);
      } else if (type === "signup" || type === "magiclink" || type === "email") {
        const role = session.user.user_metadata?.role || localStorage.getItem("userRole");
        if (role === "vendor") {
          router.replace(conts.paths.vendorOnboarding);
        } else {
          router.replace(conts.paths.foodPreferences);
        }
      }
    });
  }, [router]);

  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#4CAF50',
          },
        }}
      > 
        {children}
      </ConfigProvider>
    </ApolloNextAppProvider>
  );
}
