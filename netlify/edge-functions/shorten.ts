import { multiParser } from "https://deno.land/x/multiparser@0.114.0/mod.ts";
import { headers } from "./headers.ts";
import { fetchFromSupabase, generateShortUrl } from "./utils.ts";

export default async (request: Request): Promise<Response> => {
  try {
    const form = await multiParser(request);
    const url = form.fields.url;

    if (!url) {
      return new Response(JSON.stringify({ error: "No URL provided" }), {
        status: 400,
        headers,
      });
    }

    const shortUrl = generateShortUrl();
    await fetchFromSupabase("urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ short_url: shortUrl, long_url: url }),
    });

    return new Response(JSON.stringify({ shortUrl }), { status: 200, headers });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { status: 500, headers }
    );
  }
};