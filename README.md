# url-shortening-api-netlify-edge-supabase

[![Star on GitHub](https://img.shields.io/github/stars/samestrin/url-shortening-api-netlify-edge-supabase?style=social)](https://github.com/samestrin/url-shortening-api-netlify-edge-supabase/stargazers)[![Fork on GitHub](https://img.shields.io/github/forks/samestrin/url-shortening-api-netlify-edge-supabase?style=social)](https://github.com/samestrin/url-shortening-api-netlify-edge-supabase/network/members)[![Watch on GitHub](https://img.shields.io/github/watchers/samestrin/url-shortening-api-netlify-edge-supabase?style=social)](https://github.com/samestrin/url-shortening-api-netlify-edge-supabase/watchers)

![Version 0.0.1](https://img.shields.io/badge/Version-0.0.1-blue)[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)[![Built with Node.js](https://img.shields.io/badge/Built%20with-Node.js-green)](https://nodejs.org/)

url-shortening-api-netlify-edge-supabase is a URL shortener service. It is a serverless application that provides URL shortening and retrieval functionalities. Utilizing Netlify Edge Functions and Supabase, a cloud-based database, the application offers a high performance, efficient and scalable solution for creating short URLs that redirect to the original, longer URLs.

_This replaces the legacy [url-shortening-api-netlify-supabase](https://github.com/samestrin/url-shortening-api-netlify-supabase) project._

### **Features**

- **URL Shortening**: Convert long URLs into short, manageable links that are easier to share.
- **URL Validation**: Ensures that only valid URLs with proper protocols are processed.
- **URL Redirection**: Redirect users to the original long URL based on the short URL.
- **Retrieve Latest Shortened URLs**: Access the most recently created short URLs.
- **URL Count**: Get the total number of URLs shortened.
- **API Versioning**: Retrieve the current version of the API.
- **CORS Support**: Handle cross-origin resource sharing with appropriate headers.
- **Error Handling**: Graceful error handling with appropriate HTTP status codes and error messages.

### **Dependencies**

- **Node.js**: The script runs in a Node.js environment.
- **Deno**: A secure runtime for JavaScript and TypeScript.
- **Supabase (REST API)**: A backend-as-a-service providing a Postgres database, authentication, storage, and more.
- **Netlify Edge Functions**: Serverless functions that run at the edge, closer to your users.
- **multiParser**: Parses multipart form data.

## Endpoints

### Shorten URL

**Endpoint:** `/shorten` **Method:** POST

Shorten a long URL and return the shortened URL.

- `url`: The URL to be shortened.

#### **Example Usage**

Use a tool like Postman or curl to make a request:

```bash
curl -X POST \
  https://localhost/shorten \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'url=https://www.google.com'
```

The server responds with:

```bash
{"shortUrl":"lqywv6P"}
```

### Forward URL

**Endpoint:** `/[shortId]` **Method:** GET

Based on shortened URL, e.g. `/lqywv6P` HTTP 301 forward to a long url.

This endpoint is accessed by navigating directly to the shortened URL.

#### **Example Usage**

Use curl to make a request:

```bash
curl http://localhost/[shortId]
```

### Retrieve Latest Shortened Links

**Endpoint:** `/latest` **Method:** GET

Retrieve the latest URLs shortened.

This endpoint is accessed by navigating directly to /latest.

#### **Example Usage**

Use curl to make a request:

```bash
curl http://localhost/latest
```

### Retrieve Count

**Endpoint:** `/count` **Method:** GET

Retrieve the number of URLs shortened.

This endpoint is accessed by navigating directly to /count.

#### **Example Usage**

Use curl to make a request:

```bash
curl http://localhost/count
```

### Retrieve Version

**Endpoint:** `/version` **Method:** GET

Retrieve the current version of the API.

This endpoint is accessed by navigating directly to /version.

#### **Example Usage**

Use curl to make a request:

```bash
curl http://localhost/version
```

The server responds with:

```bash
{
    "name": "url-shortening-api-netlify-edge-supabase",
    "version": "0.0.1",
    "description": "url-shortening-api-netlify-edge-supabase is a URL shortener service using Netlify Edge Functions and the Supabase REST API.",
    "author": "Sam Estrin",
    "homepage": "https://github.com/samestrin/url-shortening-api-netlify-edge-supabase#readme"
}
```

## CORS

The server responds with appropriate CORS headers such as Access-Control-Allow-Origin.

## Error Handling

The API handles errors gracefully and returns appropriate error responses:

- **400 Bad Request**: Invalid request parameters.
- **404 Not Found**: Resource not found.
- **405 Method Not Allowed**: Invalid request method (not GET or POST).
- **500 Internal Server Error**: Unexpected server error.

## Contribute

Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes or improvements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Share

[![Twitter](https://img.shields.io/badge/X-Tweet-blue)](https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20project!&url=https://github.com/samestrin/url-shortening-api-netlify-edge-supabase) [![Facebook](https://img.shields.io/badge/Facebook-Share-blue)](https://www.facebook.com/sharer/sharer.php?u=https://github.com/samestrin/url-shortening-api-netlify-edge-supabase) [![LinkedIn](https://img.shields.io/badge/LinkedIn-Share-blue)](https://www.linkedin.com/sharing/share-offsite/?url=https://github.com/samestrin/url-shortening-api-netlify-edge-supabase)
