import { Product } from '../product.types';
import { PaginatedResult } from '../../common/pagination.types';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

export interface ProductsRepository {
  findAll(
    page: number,
    limit: number,
    name?: string, 
    orderBy?: 'price' | 'name', 
    order?: 'asc' | 'desc'
  ): Promise<PaginatedResult<Product>>;
  
  findById(id: number): Promise<Product | null>;
  
  create(input: CreateProductDto): Promise<Product>;
  update(id: number, input: UpdateProductDto): Promise<Product | null>;
  
  remove(id: number): Promise<Product | null>;
  updateStock(id: number, newStock: number): Promise<Product | null>;
}