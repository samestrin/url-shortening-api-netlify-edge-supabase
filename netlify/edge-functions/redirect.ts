import handler from "./utils.ts";

const { fetchFromSupabase } = handler();

export default async (request: Request): Promise<Response> => {
  try {
    const shortUrl = new URL(request.url).pathname.replace("/", "");
    const data = await fetchFromSupabase(
      `urls?select=long_url&short_url=eq.${shortUrl}`,
      { method: "GET" }
    );
    if (data.length === 0) {
      return new Response(JSON.stringify({ error: "URL not found" }), {
        status: 404,
      });
    }
    return new Response(null, {
      status: 301,
      headers: { Location: data[0].long_url },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { status: 500 }
    );
  }
};
