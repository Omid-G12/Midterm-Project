-- Drop and recreate Users table (Example)
-- Phone_number stored as VARCHAR since regular phone numbers will exceed the INTEGER limit

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);
