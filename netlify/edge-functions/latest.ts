import { headers } from "./headers.ts";
import handler from "./utils.ts";

const urlBase = Deno.env.get("URL_BASE") ? Deno.env.get("URL_BASE") : "";
const { fetchFromSupabase } = handler();

export default async (request: Request): Promise<Response> => {
  try {
    const url = new URL(request.url);
    const count = url.searchParams.get("count") || "10";
    const data = await fetchFromSupabase(
      `urls?order=created_at.desc&limit=${count}`,
      { method: "GET" }
    );
    const modifiedData = data.map((item: any) => ({
      ...item,
      short_url: `${urlBase}/${item.short_url}`,
    }));

    return new Response(JSON.stringify(modifiedData), { status: 200, headers });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { status: 500, headers }
    );
  }
};
