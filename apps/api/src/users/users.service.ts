import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findByEmail(email: string) {
    const result = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
    
    return result[0];
  }

  async findById(id: string) {
    const result = await this.db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
      })
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    
    return result[0];
  }

  async create(data: typeof schema.users.$inferInsert) {
    const result = await this.db
      .insert(schema.users)
      .values(data)
      .returning({
        id: schema.users.id,
        email: schema.users.email,
      });
    
    return result[0];
  }
}
