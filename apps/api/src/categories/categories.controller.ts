import { Controller, Get, Post, Body, Req, UseGuards, Delete, Param } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Request } from 'express'
import { CreateCategoryDto } from './dto/category.dto'

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const user = req.user as any
    return this.categoriesService.findAllForUser(user.id)
  }

  @Post()
  async create(@Req() req: Request, @Body() body: CreateCategoryDto) {
    const user = req.user as any
    return this.categoriesService.create(user.id, {
      name: body.name,
      color: body.color,
      icon: (body as any).icon,
    })
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as any
    await this.categoriesService.delete(user.id, id)
    return { success: true }
  }
}
