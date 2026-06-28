import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../product.types';
import { PRODUCTS_REPOSITORY, ProductsRepository } from '../repositories/products.repository';
import { CATEGORIES_REPOSITORY, CategoriesRepository } from '../../categories/repositories/categories.repository';
import { PaginatedResult } from '../../common/pagination.types';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY) private readonly productsRepository: ProductsRepository,
    @Inject(CATEGORIES_REPOSITORY) private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async findAll(page = 1, limit = 10, name?: string, orderBy?: 'price' | 'name', order?: 'asc' | 'desc'): Promise<PaginatedResult<Product>> {
    const validLimit = Math.min(Math.max(limit, 1), 50);
    const validPage = Math.max(page, 1);
    return await this.productsRepository.findAll(validPage, validLimit, name, orderBy, order);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (product === null) throw new NotFoundException('Product not found');
    return product;
  }

  async create(input: CreateProductDto): Promise<Product> {
    const category = await this.categoriesRepository.findById(input.categoryId);
    if (!category) {
      throw new BadRequestException(`Category with ID ${input.categoryId} does not exist`);
    }
    return await this.productsRepository.create(input);
  }

  async update(id: number, input: UpdateProductDto): Promise<Product> {
    if (input.categoryId !== undefined && input.categoryId !== null) {
      const category = await this.categoriesRepository.findById(input.categoryId);
      if (!category) {
        throw new BadRequestException(`Category with ID ${input.categoryId} does not exist`);
      }
    }
    
    const product = await this.productsRepository.update(id, input);
    if (product === null) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(id: number): Promise<Product> {
    const product = await this.productsRepository.remove(id);
    if (product === null) throw new NotFoundException('Product not found');
    return product;
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (product === null) throw new NotFoundException('Product not found');
    
    if (quantity > product.stock) {
      throw new BadRequestException('Stock insuficiente');
    }

    const updatedProduct = await this.productsRepository.updateStock(id, product.stock - quantity);
    if (updatedProduct === null) throw new NotFoundException('Product not found');

    return updatedProduct;
  }
}