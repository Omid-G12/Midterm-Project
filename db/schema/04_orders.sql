-- Drop and recreate orders

DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total INTEGER NOT NULL DEFAULT 0,
  time_created TIMESTAMP,
  duration INTEGER,
  is_complete BOOLEAN NOT NULL DEFAULT FALSE,
  rating INTEGER
);
