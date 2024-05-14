import { multiParser } from "https://deno.land/x/multiparser@0.114.0/mod.ts";
import { headers } from "./headers.ts";
import handler from "./utils.ts";
const urlBase = Deno.env.get("URL_BASE") || "";
const { generateShortUrl } = handler();

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
