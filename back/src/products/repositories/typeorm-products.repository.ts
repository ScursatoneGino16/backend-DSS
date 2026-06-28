import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { ProductsRepository } from './products.repository';
import { Product } from '../product.types';
import { PaginatedResult } from '../../common/pagination.types';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class TypeOrmProductsRepository implements ProductsRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  private mapToProduct(entity: ProductEntity): Product {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price,
      stock: entity.stock,
      categoryId: entity.category.id, 
    };
  }

  async findAll(
    page: number, 
    limit: number, 
    name?: string, 
    orderBy?: 'price' | 'name', 
    order: 'asc' | 'desc' = 'asc'
  ): Promise<PaginatedResult<Product>> {
    
    const query = this.repo.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');
    
    if (name) {
      query.where('LOWER(product.name) LIKE LOWER(:name)', { name: `%${name}%` });
    }
    
    if (orderBy) {
      query.orderBy(`product.${orderBy}`, order.toUpperCase() as 'ASC' | 'DESC');
    }

    const [entities, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount(); 

    return {
      data: entities.map(this.mapToProduct), 
      meta: { 
        page, 
        limit, 
        total, 
        totalPages: Math.ceil(total / limit) 
      },
    };
  }

  async findById(id: number): Promise<Product | null> {
    const product = await this.repo.findOne({ 
        where: { id },
        relations: { category: true } 
    });
    return product ? this.mapToProduct(product) : null; 
  }

  async create(input: CreateProductDto): Promise<Product> {
    const productEntity = this.repo.create(input);
    const saved = await this.repo.save(productEntity);
    return (await this.findById(saved.id))!;
  }

  async update(id: number, input: UpdateProductDto): Promise<Product | null> {
    const updateData = Object.fromEntries(
        Object.entries(input).filter(([_, v]) => v !== undefined && v !== null)
    );
    
    if (Object.keys(updateData).length > 0) {
        await this.repo.update(id, updateData);
    }
    return await this.findById(id);
  }

  async remove(id: number): Promise<Product | null> {
    const product = await this.findById(id);
    if (!product) return null; 
    await this.repo.delete(id);
    return product;
  }

  async updateStock(id: number, newStock: number): Promise<Product | null> {
    await this.repo.update(id, { stock: newStock });
    return await this.findById(id);
  }
}