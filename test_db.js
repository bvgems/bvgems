const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/bvgems" // Guessing local DB url if any, or maybe we can't connect directly.
});
