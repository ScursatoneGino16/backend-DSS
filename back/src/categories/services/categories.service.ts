import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORIES_REPOSITORY, CategoriesRepository } from '../repositories/categories.repository';
import { PaginatedResult } from '../../common/pagination.types';
import { Category } from '../categories.types';
import { Product } from '../../products/product.types';

@Injectable()
export class CategoriesService {
  constructor(@Inject(CATEGORIES_REPOSITORY) private readonly repo: CategoriesRepository) {}

  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResult<Category>> {
    const validLimit = Math.min(Math.max(limit, 1), 50);
    const validPage = Math.max(page, 1);
    return await this.repo.findAll(validPage, validLimit);
  }

  async findOne(id: number): Promise<Category> {
    const cat = await this.repo.findById(id); 
    if (cat === null) throw new NotFoundException('Category not found');
    return cat;
  }

  async create(input: { name: string }): Promise<Category> { 
    return await this.repo.create(input);
  }

  async remove(id: number): Promise<{ message: string }> {
    const products = await this.repo.findProductsByCategory(id, 1, 1);
    if (products.data.length > 0) {
      throw new ConflictException('No se puede eliminar una categoría con productos asociados');
    }

    const removed = await this.repo.remove(id); 
    
    if (!removed) {
      throw new NotFoundException('Category not found');
    }

    return { message: 'Deleted' };
  }

  async getProductsByCategory(categoryId: number, page: number = 1, limit: number = 10): Promise<PaginatedResult<Product>> {
    const category = await this.repo.findById(categoryId);
    if (category === null) throw new NotFoundException('Category not found');
    
    const validLimit = Math.min(Math.max(limit, 1), 50);
    const validPage = Math.max(page, 1);
    return await this.repo.findProductsByCategory(categoryId, validPage, validLimit);
  }
}