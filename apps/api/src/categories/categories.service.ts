import { Injectable, Inject } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from '../database/schema'
import { eq, or, and, isNull } from 'drizzle-orm'

@Injectable()
export class CategoriesService {
  constructor(@Inject('DB_CONNECTION') private readonly db: NodePgDatabase<typeof schema>) {}

  async findAllForUser(userId: string) {
    return this.db.query.categories.findMany({
      where: or(
        eq(schema.categories.userId, userId),
        isNull(schema.categories.userId), // Default categories
      ),
      orderBy: (categories, { asc }) => [asc(categories.name)],
    })
  }

  async create(userId: string, data: { name: string; color?: string; icon?: string }) {
    const result = await this.db
      .insert(schema.categories)
      .values({
        userId,
        name: data.name,
        color: data.color || '#808080',
        icon: data.icon || 'tag',
      })
      .returning()
    return result[0]
  }

  async delete(userId: string, categoryId: string) {
    // Only allow deleting custom user categories
    await this.db
      .delete(schema.categories)
      .where(and(eq(schema.categories.id, categoryId), eq(schema.categories.userId, userId)))
  }
}
