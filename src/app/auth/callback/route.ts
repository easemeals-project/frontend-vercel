import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import conts from "@/lib/conts";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
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
      const role = data.user?.user_metadata?.role;
      if (role === "vendor") {
        return NextResponse.redirect(`${origin}${conts.paths.vendorOnboarding}`);
      }
      return NextResponse.redirect(`${origin}${conts.paths.foodPreferences}`);
    }
  }

  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}${conts.paths.resetPassword}`);
      }
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      const role = data.user?.user_metadata?.role;
      if (role === "vendor") {
        return NextResponse.redirect(`${origin}${conts.paths.vendorOnboarding}`);
      }
      return NextResponse.redirect(`${origin}${conts.paths.foodPreferences}`);
    }
  }

  return NextResponse.redirect(`${origin}${conts.paths.signin}`);
}
