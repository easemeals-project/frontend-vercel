import { type ResourcesConfig } from "aws-amplify";
export const amplifyConfig = {
  Auth: {
    Cognito: {
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_APP_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_OAUTH_DOMAIN,
          // // Add "profile" when app is verified by Google
          scope: ["email", "openid"],
          redirectSignIn: [process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN as string],
          redirectSignOut: [
            process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT as string,
          ],
          responseType: "code",
          providers: ["Google", "Facebook", "Apple"],
        },
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_APPSYNC_URL,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      defaultAuthMode: "userPool",
    },
  },
} as ResourcesConfig;
