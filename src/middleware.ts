import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUserServer } from "./lib/utils/auth-utils";
import conts from "./lib/conts";

const path = conts.paths;

const protectedRoutes = [path.dashboard];

const publicAuthRoutes = [
  path.forgotPass,
  path.resetPassword,
  path.signin,
  path.signup,
  path.verify_email,
  path.role,
];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  const isAuthenticated = !!(await getAuthUserServer());

  const signInUrl = new URL(conts.paths.signin, request.url);
  const dashboardUrl = new URL(conts.paths.dashboard, request.url);

  if (isAuthenticated) {
    // If they try to visit a public auth page, redirect to dashboard
    if (publicAuthRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(dashboardUrl);
    }
    // Otherwise, they are authenticated and on a valid page (like /dashboard or /),
    // so let them proceed.
    return response;
  }

  // --- USER IS NOT AUTHENTICATED ---
  // If they try to visit a protected route, redirect to signin
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    signInUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(signInUrl);
  }
  // Otherwise, they are on a public page (like / or /signin),
  // so let them proceed.
  return response;
}

// `config.matcher` must be statically analyzable by Next.js (no template
// expressions). Use literal strings here so the build can validate the
// exported config.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
  ],
};
