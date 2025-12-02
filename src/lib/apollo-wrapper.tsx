"use client";

import { HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { SetContextLink } from "@apollo/client/link/context";
import { fetchAuthSession } from "aws-amplify/auth";
import conts from "./conts";

function makeClient() {
  const httpLink = new HttpLink({
    uri: conts.paths.server,
    credentials: "include",
    fetchOptions: { cache: "no-store" },
  });

  const authLink = new SetContextLink(async (prevContext, operation) => {
    const session = await fetchAuthSession(); // Get the latest token from storage
    const token = session.tokens?.idToken?.toString();

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
      {children}
    </ApolloNextAppProvider>
  );
}
