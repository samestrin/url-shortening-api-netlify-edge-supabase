export default async (request: Request): Promise<Response> => {
  console.log("Hello function triggered");
  return new Response("Hello, World!", {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};

export const config = {
  path: "/hello",
};
