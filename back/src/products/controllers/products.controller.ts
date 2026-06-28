import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Product } from '../product.types';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ReduceStockDto } from '../dto/reduce-stock.dto';
import { ProductsListQueryDto } from '../dto/products-list-query.dto';
import { PaginatedResult } from 'src/common/pagination.types';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/user-role.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query() query: ProductsListQueryDto): Promise<PaginatedResult<Product>> {
    return await this.productsService.findAll(
      query.page, 
      query.limit, 
      query.name, 
      query.orderBy, 
      query.order
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productsService.findOne(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() body: CreateProductDto): Promise<Product> {
    return await this.productsService.create(body);
  }

  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateStock(
    @Param('id') id: string, 
    @Body() body: ReduceStockDto
  ): Promise<Product> {
    return await this.productsService.updateStock(Number(id), body.quantity);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string, 
    @Body() body: UpdateProductDto
  ): Promise<Product | null> {
    return await this.productsService.update(Number(id), body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<Product> {
    return await this.productsService.remove(Number(id));
  }
}