import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductInput, Product, UpdateProductInput } from '../product.types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('name') name?: string,
    @Query('orderBy') orderBy?: 'price' | 'name',
    @Query('order') order?: 'asc' | 'desc',
  ): Product[] {
    return this.productsService.findAll(name, orderBy, order);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Product {
    return this.productsService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: CreateProductInput): Product {
    return this.productsService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateProductInput): Product {
    return this.productsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Product {
    return this.productsService.remove(Number(id));
  }

  @Patch(':id/stock')
  updateStock(@Param('id') id: string, @Body('quantity') quantity: number): Product {
    return this.productsService.updateStock(Number(id), quantity);
  }
}

