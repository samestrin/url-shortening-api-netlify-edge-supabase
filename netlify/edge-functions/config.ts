import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

function getConfig() {
  const env = config();

  return {
    SUPABASE_URL: env.SUPABASE_URL || Deno.env.get("SUPABASE_URL") || "",
    SUPABASE_PASSWORD:
      env.SUPABASE_PASSWORD || Deno.env.get("SUPABASE_PASSWORD") || "",
    SUPABASE_ANON_KEY:
      env.SUPABASE_ANON_KEY || Deno.env.get("SUPABASE_ANON_KEY") || "",
    URLSHORT_URL_BASE:
      env.URLSHORT_URL_BASE || Deno.env.get("URLSHORT_URL_BASE") || "",
    URLSHORT_TRACK_CLICKS:
      env.URLSHORT_TRACK_CLICKS ||
      Deno.env.get("URLSHORT_TRACK_CLICKS") ||
      false,
    URLSHORT_RESOLVE_HOSTNAME:
      env.URLSHORT_RESOLVE_HOSTNAME ||
      Deno.env.get("URLSHORT_RESOLVE_HOSTNAME") ||
      false,
  };
}

export default getConfig;
