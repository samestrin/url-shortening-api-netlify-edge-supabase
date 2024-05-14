import { headers } from "./headers.ts";
import handler from "./utils.ts";
const urlBase = Deno.env.get("URL_BASE") ? Deno.env.get("URL_BASE") : "";
const { fetchFromSupabase } = handler();

/**
 * Retrieves the latest URLs stored in Supabase.
 *
 * @param request - The incoming HTTP request.
 * @returns The latest URLs from the Supabase database or an error message.
 * @throws If an error occurs while fetching the latest URLs from Supabase.
 *
 * @example
 * // Example usage
 * curl -X GET "https://your-api-url/latest?count=5"
 */
export default async (request: Request): Promise<Response> => {
  try {
    const url = new URL(request.url);
    const count = url.searchParams.get("count") || "10";

    const response = await fetchFromSupabase(
      `urls?order=created_at.desc&limit=${count}`,
      { method: "GET" }
    );

    if (!response || !Array.isArray(response)) {
      throw new Error("Invalid response from Supabase");
    }

    const modifiedResponse = response.map((item: any) => ({
      ...item,
      short_url: `${urlBase}${item.short_url}`,
    }));

    return new Response(JSON.stringify(modifiedResponse), {
      status: 200,
      headers,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { status: 500, headers }
    );
  }
};
export const config = { path: "/latest" };
