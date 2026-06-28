import { Category, CreateCategoryInput } from '../categories.types';
import { Product } from '../../products/product.types';
import { PaginatedResult } from '../../common/pagination.types';

export const CATEGORIES_REPOSITORY = 'CATEGORIES_REPOSITORY';

export interface CategoriesRepository {
  findAll(page: number, limit: number): Promise<PaginatedResult<Category>>;
  findById(id: number): Promise<Category | null>; 
  create(input: CreateCategoryInput): Promise<Category>;
  remove(id: number): Promise<boolean>;
  findProductsByCategory(categoryId: number, page: number, limit: number): Promise<PaginatedResult<Product>>;
}