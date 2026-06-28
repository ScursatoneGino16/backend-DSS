import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { ProductEntity } from '../../products/entities/product.entity';
import { CategoriesRepository } from '../repositories/categories.repository';
import { PaginatedResult } from '../../common/pagination.types';
import { Category } from '../categories.types';
import { Product } from '../../products/product.types';

@Injectable()
export class TypeOrmCategoriesRepository implements CategoriesRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly catRepo: Repository<CategoryEntity>,
    @InjectRepository(ProductEntity)
    private readonly prodRepo: Repository<ProductEntity>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResult<Category>> {
    const validLimit = Math.min(Math.max(limit, 1), 50);
    const validPage = Math.max(page, 1);
    
    // Corregido: usando catRepo y definiendo 'entities' correctamente
    const [entities, total] = await this.catRepo.findAndCount({
      skip: (validPage - 1) * validLimit,
      take: validLimit,
    });

    return {
      data: entities, // Aquí definimos 'data' con el valor de 'entities'
      meta: {
        total,
        page: validPage,
        limit: validLimit,
        totalPages: Math.ceil(total / validLimit),
      },
    };
  }

  async findById(id: number): Promise<Category | null> {
    return await this.catRepo.findOneBy({ id });
  }

  async create(input: { name: string }): Promise<Category> { 
    const newCategory = this.catRepo.create(input);
    return await this.catRepo.save(newCategory);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.catRepo.delete(id);
    const affectedCount = result.affected ?? 0;
    return affectedCount > 0;
  }

  async findProductsByCategory(categoryId: number, page: number = 1, limit: number = 10): Promise<PaginatedResult<Product>> {
    const validLimit = Math.min(Math.max(limit, 1), 50);
    const validPage = Math.max(page, 1);

    const [entities, total] = await this.prodRepo.findAndCount({
      where: { category: { id: categoryId } },
      relations: { category: true }, // Corregido: Objeto en lugar de string[]
      skip: (validPage - 1) * validLimit,
      take: validLimit,
    });

    const data: Product[] = entities.map((p) => ({
      ...p,
      categoryId: p.category.id,
    }));

    return {
      data,
      meta: {
        total,
        page: validPage,
        limit: validLimit,
        totalPages: Math.ceil(total / validLimit),
      },
    };
  }
}