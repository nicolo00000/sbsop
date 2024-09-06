import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in the environment variables');
}

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',  // Make sure to set the correct dialect
  dbCredentials: {
    url: process.env.DATABASE_URL,  // Change 'connectionString' to 'url'
  },
} satisfies Config;
