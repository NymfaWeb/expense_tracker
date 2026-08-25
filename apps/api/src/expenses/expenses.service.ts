import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';

@Injectable()
export class ExpensesService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  private async getOrCreateDefaultCategory(userId: string) {
    let defaultCat = await this.db.select().from(schema.categories).where(eq(schema.categories.userId, userId)).limit(1);
    if (!defaultCat.length) {
      const created = await this.db.insert(schema.categories).values({
        userId,
        name: 'General',
        color: '#6366f1', // Indigo
      }).returning();
      return created[0].id;
    }
    return defaultCat[0].id;
  }

  async create(userId: string, data: { amount: string, title: string, expenseDate: string, isBusiness?: boolean }) {
    const categoryId = await this.getOrCreateDefaultCategory(userId);
    
    const result = await this.db
      .insert(schema.expenses)
      .values({
        userId,
        categoryId,
        amount: data.amount,
        title: data.title,
        expenseDate: data.expenseDate,
        isBusiness: data.isBusiness ?? false,
      })
      .returning();
    
    return result[0];
  }

  async findAll(userId: string, filters: { type?: 'all' | 'private' | 'business', start?: string, end?: string }) {
    let conditions = [eq(schema.expenses.userId, userId)];

    if (filters.type === 'private') conditions.push(eq(schema.expenses.isBusiness, false));
    if (filters.type === 'business') conditions.push(eq(schema.expenses.isBusiness, true));
    
    if (filters.start) conditions.push(gte(schema.expenses.expenseDate, filters.start));
    if (filters.end) conditions.push(lte(schema.expenses.expenseDate, filters.end));

    return await this.db
      .select({
        id: schema.expenses.id,
        amount: schema.expenses.amount,
        currency: schema.expenses.currency,
        title: schema.expenses.title,
        expenseDate: schema.expenses.expenseDate,
        isBusiness: schema.expenses.isBusiness,
        category: {
          id: schema.categories.id,
          name: schema.categories.name,
          color: schema.categories.color,
        }
      })
      .from(schema.expenses)
      .leftJoin(schema.categories, eq(schema.expenses.categoryId, schema.categories.id))
      .where(and(...conditions))
      .orderBy(schema.expenses.expenseDate); // chronologicznie
  }

  async getSummary(userId: string) {
    const result = await this.db
      .select({
        totalExpenses: sql<number>`COALESCE(SUM(${schema.expenses.amount}::numeric), 0)::float`,
        activeSubscriptions: sql<number>`COUNT(*) FILTER (WHERE ${schema.expenses.title} ILIKE '%sub%')::int`
      })
      .from(schema.expenses)
      .where(eq(schema.expenses.userId, userId));
      
    return result[0] || { totalExpenses: 0, activeSubscriptions: 0 };
  }
}
