import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './src/database/schema'
import * as bcrypt from 'bcrypt'

const pool = new Pool({
  connectionString: 'postgresql://postgres:password@localhost:5432/expense_tracker',
})

const db = drizzle(pool, { schema })

async function seed() {
  console.log('Seeding data...')

  await pool.query(`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "email" varchar(255) NOT NULL,
      "password_hash" varchar(255) NOT NULL,
      "first_name" varchar(100),
      "last_name" varchar(100),
      "created_at" timestamp with time zone DEFAULT now(),
      "updated_at" timestamp with time zone DEFAULT now(),
      CONSTRAINT "users_email_unique" UNIQUE("email")
    );
  `)

  const passwordHash = await bcrypt.hash('password123', 10)

  await db
    .insert(schema.users)
    .values({
      email: 'test@example.com',
      passwordHash,
      firstName: 'Test',
      lastName: 'User',
    })
    .onConflictDoNothing()

  console.log('Data seeded successfully!')
  process.exit(0)
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
