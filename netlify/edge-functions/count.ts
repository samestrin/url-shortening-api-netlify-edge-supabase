import { headers } from "./headers.ts";
import handler from "./utils.ts";
const { fetchFromSupabase } = handler();

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
