import handler from "./utils.ts";
const { fetchFromSupabase, logClick, validateIpAddress } = handler();

const trackClicks = Deno.env.get("URLSHORT_TRACK_CLICKS") || false;
/**
 * Handles redirection for shortened URLs, logs the click, IP address, and hostname.
 *
 * @param request - The incoming request object.
 * @returns A response object with a redirection or an error message.
 * @throws Throws an error if there is an issue with fetching data from Supabase or logging the click.
 *
 * @example
 * // Example usage
 * curl -X GET https://your-api-url/shortUrl
 */
export default async (
  request: Request,
  connInfo: Deno.ServeHandlerInfo
): Promise<Response> => {
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

    if (trackClicks) {
      // Extract IP address from connInfo
      const addr = connInfo.remoteAddr as Deno.NetAddr;
      const ip = addr?.hostname || "";
      let ipAddress = ip || request.headers.get("x-forwarded-for") || "";

      let hostname = "";
      if (validateIpAddress(ipAddress)) {
        try {
          hostname = await getHostnameFromIp(ipAddress);
        } catch (error) {
          console.error(`Error resolving hostname for IP ${ipAddress}:`, error);
        }
      } else {
        ipAddress = "";
        hostname = "unknown";
      }

      // Log the click with IP address and hostname
      await logClick(urlId, ipAddress, hostname);
    }

    return new Response(null, {
      status: 302,
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

/**
 * Resolves the hostname from an IP address using a reverse DNS lookup.
 *
 * @param ip - The IP address to resolve.
 * @returns A promise that resolves to the hostname.
 * @throws Throws an error if the DNS lookup fails.
 *
 * @example
 * // How to use the function
 * const hostname = await getHostnameFromIp("8.8.8.8");
 * console.log(hostname); // Example output: "dns.google"
 */
export async function getHostnameFromIp(ip: string): Promise<string> {
  try {
    // Perform a reverse DNS lookup to get the PTR record for the IP address
    const hostnames = await Deno.resolveDns(ip, "PTR");

    if (hostnames.length > 0) {
      // Return the first hostname in the result
      return hostnames[0];
    } else {
      //throw new Error(`No hostname found for IP: ${ip}`);
      console.error(`No hostname found for IP: ${ip}`);
    }
  } catch (error) {
    console.error(`Failed to resolve hostname for IP: ${ip}`, error);
    throw error;
  }
}
