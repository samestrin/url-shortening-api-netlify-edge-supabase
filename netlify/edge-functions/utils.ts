const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_KEY = Deno.env.get("SUPABASE_ANON_KEY");

/**
 * Fetches data from Supabase.
 *
 * @param endpoint - The API endpoint to fetch data from.
 * @param options - Request options to configure the fetch request.
 * @returns The fetched data from Supabase.
 * @throws If the request to Supabase fails.
 *
 * @example
 * // Example usage
 * fetchFromSupabase('urls', { method: 'GET' })
 *   .then(data => console.log(data));
 */
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

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.statusText}`);
  }
  let jsonResponse = await response.json();

  return jsonResponse;
}

/**
 * Generates a short URL for a given long URL.
 *
 * @param longUrl - The long URL to be shortened.
 * @returns The generated short URL.
 * @throws If an error occurs while generating or storing the short URL.
 *
 * @example
 * // Example usage
 * generateShortUrl('https://example.com')
 *   .then(shortUrl => console.log(shortUrl));
 */
export async function generateShortUrl(longUrl: string): Promise<string> {
  try {
    const data = await fetchFromSupabase(
      "urls?select=short_url&long_url=eq." + longUrl,
      { method: "GET" }
    );

    if (!data) {
      console.error("Error checking for existing long URL.");
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
      isCollision = !!data;
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

/**
 * Generates a short UUID.
 *
 * @returns A short UUID string.
 *
 * @example
 * // Example usage
 * const shortUuid = generateUuidShort();
 * console.log(shortUuid);
 */
export function generateUuidShort(): string {
  return crypto.randomUUID().substring(0, 7);
}

/**
 * Logs a click for a given URL.
 *
 * @param urlId - The ID of the URL for which the click is being logged.
 * @throws Throws an error if logging the click fails.
 *
 * @example
 * // How to utilize the function effectively.
 * await logClick(1);
 */
export async function logClick(urlId: number): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/clicks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ url_id: urlId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to log click: ${response.statusText}`);
  }
}

/**
 * Provides utility functions for utils.ts.
 *
 * @returns An object containing utility functions.
 *
 * @example
 * // Example usage
 * const utils = handler();
 * utils.fetchFromSupabase('urls', { method: 'GET' })
 *   .then(data => console.log(data));
 */

export default function handler() {
  return {
    fetchFromSupabase,
    generateShortUrl,
    generateShortUrl,
  };
}
