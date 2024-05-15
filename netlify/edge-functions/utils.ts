import { getConfig } from "./config.ts";
const {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  URLSHORT_DEFAULT_IP_ADDRESS_ID,
  URLSHORT_DEFAULT_HOSTNAME_ID,
} = getConfig();

/**
 * Fetches data from Supabase.
 *
 * @param endpoint - The API endpoint to fetch data from.
 * @param options - Request options to configure the fetch request.
 * @returns The fetched data from Supabase.
 * @throws If the request to Supabase fails.
 *
 * @example
 * // Example usage
 * fetchFromSupabase('urls', { method: 'GET' })
 *   .then(data => console.log(data));
 */
export async function fetchFromSupabase(
  endpoint: string,
  options: RequestInit
) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.statusText}`);
  }

  let jsonResponse;
  try {
    jsonResponse = await response.json();
  } catch (error) {
    console.error("Error parsing JSON response from Supabase:", error);
    throw new Error("Invalid JSON response from Supabase");
  }

  return jsonResponse;
}

/**
 * Writes data to Supabase.
 *
 * @param endpoint - The API endpoint to write data to.
 * @param options - Request options to configure the fetch request.
 * @returns An object containing ok and statusText.
 * @throws If the request to Supabase fails.
 *
 * @example
 * // Example usage
 * writeToSupabase('urls', { method: 'POST', body: JSON.stringify({ ... }) })
 *   .then(response => console.log(response));
 */
export async function writeToSupabase(endpoint: string, options: RequestInit) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.statusText}`);
  }

  return {
    ok: response.ok,
    statusText: response.statusText,
  };
}

/**
 * Generates a short URL for a given long URL.
 *
 * @param longUrl - The long URL to be shortened.
 * @returns The generated short URL.
 * @throws If an error occurs while generating or storing the short URL.
 *
 * @example
 * // Example usage
 * generateShortUrl('https://example.com')
 *   .then(shortUrl => console.log(shortUrl));
 */
export async function generateShortUrl(longUrl: string): Promise<string> {
  try {
    const data = await fetchFromSupabase(
      `urls?select=short_url&long_url=eq.${longUrl}`,
      { method: "GET" }
    );

    if (!data) {
      console.error("Error checking for existing long URL.");
      throw new Error("No data returned from Supabase");
    }
    if (data && data[0]?.short_url) {
      return data[0].short_url;
    }

    let shortUrl: string;
    let isCollision = true;

    while (isCollision) {
      shortUrl = generateUuidShort();
      const collisionData = await fetchFromSupabase(
        `urls?select=short_url&short_url=eq.${shortUrl}`,
        { method: "GET" }
      );
      if (!collisionData) {
        console.error("Error checking for collision.");
        throw new Error("No data returned from Supabase");
      }
      isCollision = collisionData.length > 0;
    }

    const insertResponse = await writeToSupabase("urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ short_url: shortUrl, long_url: longUrl }),
    });

    if (!insertResponse.ok) {
      console.error("Error inserting new URL.");
      throw new Error(insertResponse.statusText);
    }

    return shortUrl;
  } catch (err) {
    console.error("Error in generateShortUrl function:", err);
    throw err;
  }
}

/**
 * Generates a short UUID.
 *
 * @returns A short UUID string.
 *
 * @example
 * // Example usage
 * const shortUuid = generateUuidShort();
 * console.log(shortUuid);
 */
export function generateUuidShort(): string {
  return crypto.randomUUID().substring(0, 7);
}

/**
 * Validates an IP address (IPv4 or IPv6).
 *
 * @param ip - The IP address to validate.
 * @returns A boolean indicating whether the IP address is valid.
 *
 * @example
 * // Validate IPv4 address
 * const isValid = validateIpAddress("192.168.1.1");
 * console.log(isValid); // true
 *
 * // Validate IPv6 address
 * const isValid = validateIpAddress("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
 * console.log(isValid); // true
 */
export function validateIpAddress(ip: string): boolean {
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^[0-9a-fA-F]{1,4}(:[0-9a-fA-F]{1,4}){7}$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Logs a click for a given URL, including the IP address and hostname.
 *
 * @param urlId - The ID of the URL for which the click is being logged.
 * @param ipAddress - The IP address of the user accessing the URL.
 * @param hostname - The hostname derived from the user's IP address.
 * @returns A boolean indicating if the record was created.
 * @throws Throws an error if logging the click or hostname fails.
 *
 * @example
 * // How to utilize the function effectively.
 * await logClick(1, '192.168.1.1', 'comcast.com');
 */
export async function logClick(
  urlId: number,
  ipAddress: string,
  hostname: string
): Promise<void> {
  // Fetch or insert the IP address
  let ipAddressId;

  if (!ipAddress) {
    ipAddressId = URLSHORT_DEFAULT_IP_ADDRESS_ID;
  } else {
    let ipAddressData = await fetchFromSupabase(
      `ip_addresses?address=eq.${ipAddress}`,
      {
        method: "GET",
      }
    );

    if (ipAddressData.length === 0) {
      const insertResponse = await writeToSupabase("ip_addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: ipAddressToUse }),
      });

      if (!insertResponse.ok) {
        throw new Error(insertResponse.statusText);
      }

      ipAddressData = await fetchFromSupabase(
        `ip_addresses?address=eq.${ipAddressToUse}`,
        {
          method: "GET",
        }
      );

      if (ipAddressData.length === 0) {
        throw new Error("Failed to retrieve IP address after insertion.");
      }

      ipAddressId = ipAddressData[0].id;
    } else {
      ipAddressId = ipAddressData[0].id;
    }
  }

  // Fetch or insert the hostname
  let hostnameId;

  if (!hostname) {
    hostnameId = URLSHORT_DEFAULT_HOSTNAME_ID;
  } else {
    let hostnameData = await fetchFromSupabase(
      `hostnames?name=eq.${hostname}`,
      {
        method: "GET",
      }
    );

    if (hostnameData.length === 0) {
      const insertResponse = await writeToSupabase("hostnames", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: hostname }),
      });

      if (!insertResponse.ok) {
        throw new Error(insertResponse.statusText);
      }

      hostnameData = await fetchFromSupabase(`hostnames?name=eq.${hostname}`, {
        method: "GET",
      });

      if (hostnameData.length === 0) {
        throw new Error("Failed to retrieve hostname after insertion.");
      }

      hostnameId = hostnameData[0].id;
    } else {
      hostnameId = hostnameData[0].id;
    }
  }

  // Log the click
  const body = JSON.stringify({
    url_id: urlId,
    ip_address_id: ipAddressId,
    hostname_id: hostnameId,
  });

  const insertClickResponse = await writeToSupabase("clicks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  if (!insertClickResponse.ok) {
    throw new Error(insertClickResponse.statusText);
  }
}

/**
 * Provides utility functions for utils.ts.
 *
 * @returns An object containing utility functions.
 *
 * @example
 * // Example usage
 * const utils = handler();
 * utils.fetchFromSupabase('urls', { method: 'GET' })
 *   .then(data => console.log(data));
 */
export default function handler() {
  return {
    fetchFromSupabase,
    writeToSupabase,
    generateShortUrl,
    generateUuidShort,
    logClick,
    validateIpAddress,
  };
}
