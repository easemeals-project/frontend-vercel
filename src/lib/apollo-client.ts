import { CombinedGraphQLErrors, ErrorLike, HttpLink } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/client-integration-nextjs";
import { cookies, headers } from "next/headers";
import { getAuthUserServer } from "./utils/auth-utils";
import { GraphQLResult } from "aws-amplify/api";
import conts from "./conts";

export const { getClient, query } = registerApolloClient(async () => {
  const res = await getAuthUserServer();

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: conts.paths.server,
      fetchOptions: { cache: "no-store" },
      headers: {
        authorization: res?.token ? `Bearer ${res.token}` : "",
      },
    }),
  });
});

export async function safeQuery<T>(options: any): Promise<T | string> {
  try {
    const { data } = await query<T>(options);
    return data || "";
  } catch (error) {
    const err = error as ErrorLike;
    console.error("GraphQL Query Error:", err?.message);
    return err.message;
  }
}
