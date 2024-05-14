const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_KEY = Deno.env.get("SUPABASE_ANON_KEY");

export async function fetchFromSupabase(
  endpoint: string,
  options: RequestInit
) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  return await response.json();
}

export function generateShortUrl(): string {
  return crypto.randomUUID().substring(0, 7);
}

export default {
  fetchFromSupabase,
  generateShortUrl,
};
