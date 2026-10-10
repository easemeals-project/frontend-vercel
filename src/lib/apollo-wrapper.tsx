"use client";

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
