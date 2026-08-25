import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, ExpensesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
