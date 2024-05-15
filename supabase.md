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
-- Create the urls table
CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    short_url VARCHAR(255) UNIQUE NOT NULL,
    long_url VARCHAR(2048) NOT NULL,
    user_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the hostnames table
CREATE TABLE hostnames (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);
-- Insert a record into the hostnames table for unknown hostnames
INSERT INTO hostnames (name) VALUES ('unknown');

-- Create the ip_addresses table
CREATE TABLE ip_addresses (
    id SERIAL PRIMARY KEY,
    address VARCHAR(45) UNIQUE NOT NULL
);

-- Insert a record into the ip_addresses table for unknown ip_addresses
INSERT INTO ip_addresses (address) VALUES ('unknown');

-- Create the clicks table
CREATE TABLE clicks (
    id SERIAL PRIMARY KEY,
    url_id INT REFERENCES urls(id) ON DELETE CASCADE,
    ip_address_id INT REFERENCES ip_addresses(id),
    hostname_id INT REFERENCES hostnames(id),
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Row Level Security (RLS)**:

Enable RLS for your tables to ensure that your data is secure and accessible only according to your specified policies.
