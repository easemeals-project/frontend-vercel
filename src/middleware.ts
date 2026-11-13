import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUserServer } from "./lib/utils/auth-utils";
import conts from "./lib/conts";
import { UserRole } from "./lib/types";

const path = conts.paths;

const protectedRoutes = [
  path.shopper,
  path.vendor,
  path.chef,
];

const publicAuthRoutes = [
  path.forgotPass,
  path.signin,
  path.signup,
  path.verify_email,
  path.role,
];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname, searchParams } = request.nextUrl;

  // If Supabase email verification or recovery redirects to the root URL with ?code= or ?token_hash=,
  // forward it immediately to /auth/callback so the session is exchanged and redirected properly.
  if (
    pathname === "/" &&
    (searchParams.has("code") || searchParams.has("token_hash"))
  ) {
    const callbackUrl = new URL("/auth/callback", request.url);
    searchParams.forEach((val, key) => callbackUrl.searchParams.set(key, val));
    return NextResponse.redirect(callbackUrl);
  }

  const authData = await getAuthUserServer();
  const isAuthenticated = !!authData;

  const signInUrl = new URL(conts.paths.signin, request.url);

  if (isAuthenticated) {
    const userRole = authData.user?.role?.toLowerCase();

    // Determine home based on role
    let homeUrlStr = path.shopper; // Default/Shopper home (now /shopper/dashboard)
    if (userRole === UserRole.chef.toLowerCase()) homeUrlStr = path.chef;
    else if (userRole === UserRole.vendor.toLowerCase()) homeUrlStr = path.vendor;

    const homeUrl = new URL(homeUrlStr, request.url);

    // If they try to visit a public auth page (except verification success screen), redirect to their role's home
    if (
      publicAuthRoutes.some((route) => pathname.startsWith(route)) &&
      !(pathname.startsWith(path.verify_email) && searchParams.get("verified") === "true")
    ) {
      return NextResponse.redirect(homeUrl);
    }

    // Role-based Access Control
    if (userRole ===  UserRole.vendor.toLowerCase()) {
      // Vendors should not access shopper or chef routes
      if (
        pathname.startsWith(path.shopper) ||
        pathname.startsWith(path.chef)
      ) {
        return NextResponse.redirect(homeUrl);
      }
    } else if (userRole === UserRole.shopper.toLowerCase()) {
      // Shoppers should not access vendor or chef routes
      if (
        pathname.startsWith(path.vendor) ||
        pathname.startsWith(path.chef)
      ) {
        return NextResponse.redirect(homeUrl);
      }
    } else if (userRole === UserRole.chef.toLowerCase()) {
      // Chefs should not access shopper or vendor routes
      if (
        pathname.startsWith(path.shopper) ||
        pathname.startsWith(path.vendor)
      ) {
        return NextResponse.redirect(homeUrl);
      }
    }

    // Otherwise, they are allowed
    return response;
  }

  // --- USER IS NOT AUTHENTICATED ---
  // If they try to visit a protected route, redirect to signin
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    signInUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Otherwise, they are on a public page
  return response;
}

// `config.matcher` must be statically analyzable by Next.js
export const config = {
  matcher: [
    "/",
    "/shopper/:path*",
    "/vendor/:path*",
    "/chef/:path*",
    "/auth/:path*",
  ],
};
