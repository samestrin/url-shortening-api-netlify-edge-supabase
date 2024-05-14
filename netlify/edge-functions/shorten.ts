import { multiParser } from "https://deno.land/x/multiparser@0.114.0/mod.ts";
import { isURL } from "https://deno.land/x/is_url/mod.ts";

import { headers } from "./headers.ts";
import handler from "./utils.ts";
const urlBase = Deno.env.get("URL_BASE") || "";
const { generateShortUrl } = handler();

/**
 * Redirects to the long URL associated with the given short URL.
 *
 * @param request - The incoming HTTP request.
 * @returns A redirection response to the long URL or an error message.
 * @throws If an error occurs while fetching the long URL from Supabase.
 *
 * @example
 * // Example usage
 * curl -X GET https://your-api-url/shortUrl
 */
export default async (request: Request): Promise<Response> => {
  try {
    const formData = await multiParser(request);
    const url = formData.fields.url;

    if (!url) {
      return new Response(JSON.stringify({ error: "No URL provided" }), {
        status: 400,
        headers,
      });
    }

    if (!isURL(url)) {
      return new Response(JSON.stringify({ error: "Invalid URL provided" }), {
        status: 400,
        headers,
      });
    }

    let shortUrl = await generateShortUrl(url);
    shortUrl = urlBase + shortUrl;

    return new Response(JSON.stringify({ shortUrl }), { status: 200, headers });
  } catch (error) {
    console.error("Error in function execution:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      { status: 500, headers }
    );
  }
};

export const config = { path: "/shorten" };
