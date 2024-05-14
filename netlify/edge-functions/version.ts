import packageJson from "../../package.json" assert { type: "json" };

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
