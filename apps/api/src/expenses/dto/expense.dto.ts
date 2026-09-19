import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString, IsUUID } from 'class-validator'

export class CreateExpenseDto {
  @IsNumber()
  amount: number

  @IsString()
  title: string

  @IsDateString()
  expenseDate: string

  @IsBoolean()
  isBusiness: boolean

  @IsOptional()
  @IsUUID()
  categoryId?: string
}

export class UpdateExpenseDto {
  @IsOptional()
  @IsNumber()
  amount?: number

  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsDateString()
  expenseDate?: string

  @IsOptional()
  @IsBoolean()
  isBusiness?: boolean

  @IsOptional()
  @IsUUID()
  categoryId?: string
}
