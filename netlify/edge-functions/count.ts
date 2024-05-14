import headers from "./headers.ts";
import { fetchFromSupabase } from "./utils.ts";

export default async (request: Request): Promise<Response> => {
  try {
    const data = await fetchFromSupabase("urls?select=id", { method: "GET" });
    const count = data.length;
    return new Response(JSON.stringify({ count }), { status: 200, headers });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { status: 500, headers }
    );
  }
};
