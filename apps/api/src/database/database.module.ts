import { Module, Global } from '@nestjs/common'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const DATABASE_CONNECTION = 'DATABASE_CONNECTION'

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: () => {
        const pool = new Pool({
          connectionString:
            process.env.DATABASE_URL ||
            'postgresql://postgres:password@localhost:5432/expense_tracker',
        })
        return drizzle(pool, { schema })
      },
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
