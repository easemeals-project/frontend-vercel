import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import conts from "@/lib/conts";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const roleParam = searchParams.get("role");
  const next = searchParams.get("next");

  const supabase = await createClient();

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}${conts.paths.resetPassword}`);
      }
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      if (type === "oauth") {
        const userRole = data.user?.user_metadata?.role || roleParam || "shopper";
        if (roleParam && !data.user?.user_metadata?.role) {
          await supabase.auth.updateUser({ data: { role: roleParam } });
        }
        if (userRole === "vendor") {
          return NextResponse.redirect(`${origin}${conts.paths.vendorDashboard}`);
        }
        return NextResponse.redirect(`${origin}${conts.paths.timetable}`);
      }
      // Sign out temporary signup session so user can log in cleanly from the verification success page
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}${conts.paths.verify_email}?verified=true`);
    }
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash,
    });
    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}${conts.paths.resetPassword}`);
      }
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}${conts.paths.verify_email}?verified=true`);
    }
  }

  // Even if PKCE code exchange couldn't complete (e.g. link opened in a different browser/device),
  // Supabase's /auth/v1/verify endpoint already verified the email before redirecting here.
  return NextResponse.redirect(`${origin}${conts.paths.verify_email}?verified=true`);
}
