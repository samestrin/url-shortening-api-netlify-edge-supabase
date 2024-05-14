import packageJson from "../../package.json" assert { type: "json" };

/**
 * Retrieves the current version of the API.
 *
 * @param request - The incoming HTTP request.
 * @returns A response containing the API version information or an error message.
 * @throws If an error occurs while reading the package.json file.
 *
 * @example
 * // Example usage
 * curl -X GET https://your-api-url/version
 */
export default async (request: Request): Promise<Response> => {
  try {
    const { name, description, author, homepage, version } = packageJson;

    const response = {
      name,
      version,
      description,
      author,
      homepage,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error reading package.json:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      { status: 500 }
    );
  }
};

export const config = { path: "/version" };
