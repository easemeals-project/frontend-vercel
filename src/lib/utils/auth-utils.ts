import { createClient } from "@/lib/supabase/server";
import { UserSession } from "../types";

export async function getAuthUserServer() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.user) return null;

    const user: UserSession = {
      email: session.user.email || "",
      name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || "",
      role: session.user.user_metadata?.role || "shopper",
    };

    return {
      user,
      token: session.access_token,
    };
  } catch (error) {
    return null;
  }
}
