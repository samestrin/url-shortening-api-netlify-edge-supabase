import handler from "./utils.ts";
const { fetchFromSupabase } = handler();

/**
 * Redirects to the long URL associated with the given short URL.
 *
 * @param request - The incoming HTTP request.
 * @returns A redirection response to the long URL or an error message.
 * @throws If an error occurs while fetching the long URL from Supabase.
 *
 * @example
 * // Example usage
 * curl -X GET https://your-api-url/shortUrl
 */
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
