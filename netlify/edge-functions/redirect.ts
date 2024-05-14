import handler from "./utils.ts";
const { fetchFromSupabase, logClick } = handler();

export default async (request: Request): Promise<Response> => {
  try {
    const shortUrl = new URL(request.url).pathname.replace("/", "");
    const data = await fetchFromSupabase(
      `urls?select=id,long_url&short_url=eq.${shortUrl}`,
      { method: "GET" }
    );

    if (data.length === 0) {
      return new Response(JSON.stringify({ error: "URL not found" }), {
        status: 404,
      });
    }

    const urlId = data[0].id;
    const longUrl = data[0].long_url;

    // Log the click
    await logClick(urlId);

    return new Response(null, {
      status: 301,
      headers: { Location: longUrl },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      { status: 500 }
    );
  }
};
