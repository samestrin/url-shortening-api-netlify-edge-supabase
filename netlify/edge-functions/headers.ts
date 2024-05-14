/**
 * Common HTTP headers used in responses.
 *
 * @returns An object containing common HTTP headers.
 *
 * @example
 * // Example usage
 * const headers = getHeaders();
 * fetch('/api', { headers });
 */

export const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Max-Age": "86400",
  "Content-Type": "application/json",
};
export default () => headers;
