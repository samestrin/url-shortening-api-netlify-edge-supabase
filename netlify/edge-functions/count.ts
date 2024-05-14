import { headers } from "./headers.ts";
import handler from "./utils.ts";
const { fetchFromSupabase } = handler();

/**
 * Counts the number of URLs stored in Supabase.
 *
 * @param request - The incoming HTTP request.
 * @returns The number of URLs in the Supabase database or an error message.
 * @throws If an error occurs while fetching the count from Supabase.
 *
 * @example
 * // Example usage
 * curl -X GET https://your-api-url/count
 */
export default async (request: Request): Promise<Response> => {
  try {
    const response = await fetchFromSupabase("urls?select=id", {
      method: "GET",
    });
    if (!response || !Array.isArray(response)) {
      throw new Error("Invalid response from Supabase");
    }
    const count = response.length;
    return new Response(JSON.stringify({ count }), { status: 200, headers });
  } catch (err) {
    console.error("Error fetching count:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { status: 500, headers }
    );
  }
};
export const config = { path: "/count" };
