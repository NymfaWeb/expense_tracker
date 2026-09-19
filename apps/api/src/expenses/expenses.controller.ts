import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common'
import { ExpensesService } from './expenses.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Request } from 'express'
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto'

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async create(@Req() req: Request, @Body() body: CreateExpenseDto) {
    const user = req.user as any
    return this.expensesService.create(user.id, {
      amount: body.amount,
      title: body.title,
      expenseDate: body.expenseDate,
      isBusiness: body.isBusiness,
      categoryId: body.categoryId,
    })
  }

  @Get('summary')
  async getSummary(@Req() req: Request) {
    const user = req.user as any
    return this.expensesService.getSummary(user.id)
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query('type') type?: 'all' | 'private' | 'business',
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    const user = req.user as any
    return this.expensesService.findAll(user.id, { type, start, end })
  }

  @Put(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() body: UpdateExpenseDto) {
    const user = req.user as any
    return this.expensesService.update(user.id, id, {
      amount: body.amount,
      title: body.title,
      expenseDate: body.expenseDate,
      isBusiness: body.isBusiness,
      categoryId: body.categoryId,
    })
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as any
    return this.expensesService.delete(user.id, id)
  }
}
