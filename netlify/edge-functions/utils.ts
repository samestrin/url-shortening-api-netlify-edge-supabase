const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_KEY = Deno.env.get("SUPABASE_ANON_KEY");

export async function fetchFromSupabase(
  endpoint: string,
  options: RequestInit
) {
  console.log("options", options);
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.statusText}`);
  }
  let jsonResponse = await response.json();
  console.log("jsonResponse", jsonResponse);
  return jsonResponse;
}
import {
  fetchFromSupabase,
  generateShortUrl as generateUuidShort,
} from "./utils.ts";
export async function generateShortUrl(longUrl: string): Promise<string> {
  try {
    let { data, error } = await fetchFromSupabase(
      "urls?select=short_url&long_url=eq." + longUrl,
      { method: "GET" }
    );
    if (error) {
      console.error("Error checking for existing long URL:", error);
      throw error;
    }
    if (data && data[0]?.short_url) {
      return data[0].short_url;
    }
    let shortUrl: string;
    let isCollision = true;
    while (isCollision) {
      shortUrl = generateUuidShort();
      ({ data, error } = await fetchFromSupabase(
        "urls?select=short_url&short_url=eq." + shortUrl,
        { method: "GET" }
      ));
      if (error) {
        console.error("Error checking for collision:", error);
        throw error;
      }
      console.log(data);
      console.log(error);
      isCollision = data.length > 0;
    }
    ({ data, error } = await fetchFromSupabase("urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ short_url: shortUrl, long_url: longUrl }),
    }));
    if (error) {
      console.error("Error inserting new URL:", error);
      throw error;
    }
    return shortUrl;
  } catch (err) {
    console.error("Error in generateShortUrl function:", err);
    throw err;
  }
}
export function generateUuidShort(): string {
  return crypto.randomUUID().substring(0, 7);
}
export default function handler() {
  return {
    fetchFromSupabase,
    generateShortUrl,
    generateShortUrl,
  };
}
