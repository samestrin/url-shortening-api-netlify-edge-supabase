import { multiParser } from "https://deno.land/x/multiparser@0.114.0/mod.ts";
import { isURL } from "https://deno.land/x/is_url/mod.ts";
import { headers } from "./headers.ts";
import handler from "./utils.ts";
const { generateShortUrl } = handler();
import { getConfig } from "./config.ts";
const { URLSHORT_URL_BASE } = getConfig();

/**
 * Shortens a given long URL and stores it in Supabase.
 *
 * @param request - The incoming HTTP request.
 * @returns The shortened URL or an error message.
 * @throws If an error occurs while shortening the URL or storing it in Supabase.
 *
 * @example
 * // Example usage
 * curl -X POST https://your-api-url/shorten -d "url=https://example.com"
 * curl -X POST https://your-api-url/shorten -F "url=https://example.com"
 */
export default async (request: Request): Promise<Response> => {
  try {
    let url: string | null = null;

    const contentType = request.headers.get("content-type");
    if (contentType && contentType.includes("multipart/form-data")) {
      const formData = await multiParser(request);
      url = formData.fields.url;
    } else if (
      contentType &&
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      const formData = new URLSearchParams(await request.text());
      url = formData.get("url");
    }

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
    console.log("url", url);
    let shortUrl = await generateShortUrl(url);
    console.log("shortUrl", shortUrl);
    shortUrl = URLSHORT_URL_BASE + shortUrl;

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
