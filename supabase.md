# url-shortening-api-netlify-edge-supabase

## Supabase Setup

Setting up Supabase for your project involves a few key steps, from creating an account to initializing your database and integrating it with your application. Here’s a detailed walkthrough:

**Sign Up and Create a New Project**:

Visit [Supabase](https://supabase.io/) and sign up for a new account if you don't already have one.

Once logged in, create a new project by specifying a project name, database password, and the region closest to your users to minimize latency.

**Project Setup**:

After your project is created, which might take a few minutes, you will be redirected to the project dashboard.

Your project’s URL (`SUPABASE_URL`) and anon key (`SUPABASE_ANON_KEY`), which are required for connecting your application to Supabase, can be found under the `Settings` -> `API` section of your Supabase project dashboard.

## Database Configuration

Create Tables: Use the SQL editor in Supabase to create the necessary tables for your application. For the URL shortener, you’ll need a table to store URLs with columns for the short URL and the original URL.

```sql
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  short_url VARCHAR(255) UNIQUE NOT NULL,
  long_url VARCHAR(2048) NOT NULL
);
```

**Row Level Security (RLS)**:

Enable RLS for your tables to ensure that your data is secure and accessible only according to your specified policies.
