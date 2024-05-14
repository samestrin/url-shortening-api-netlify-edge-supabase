import { headers } from "./headers.ts";
import handler from "./utils.ts";

const { fetchFromSupabase } = handler();

export default async (request: Request): Promise<Response> => {
  try {
    const url = new URL(request.url);
    const count = url.searchParams.get("count") || "10";
    const data = await fetchFromSupabase(
      `urls?order=created_at.desc&limit=${count}`,
      { method: "GET" }
    );
    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { status: 500, headers }
    );
  }
};
