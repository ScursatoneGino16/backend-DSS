import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import { ProductsRepository } from './products.repository';

export class InMemoryProductsRepository implements ProductsRepository {
  private products: Product[] = [];
  private nextId = 1;

  findAll(name?: string, orderBy?: 'price' | 'name', order: 'asc' | 'desc' = 'asc'): Product[] {
    let result = [...this.products];

    if (name) {
      result = result.filter((p) => p.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (orderBy) {
      result.sort((a, b) => {
        const valA = a[orderBy];
        const valB = b[orderBy];
        const multiplier = order === 'desc' ? -1 : 1;
        return valA < valB ? -1 * multiplier : 1 * multiplier;
      });
    }

    return result;
  }

  findById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  create(input: CreateProductInput): Product {
    const product: Product = {
      id: this.nextId++,
      name: input.name,
      price: input.price,
      stock: input.stock,
    };

    this.products.push(product);
    return product;
  }

  update(id: number, input: UpdateProductInput): Product | undefined {
    const product = this.findById(id);
    if (!product) return undefined;

    if (input.name !== undefined) product.name = input.name;
    if (input.price !== undefined) product.price = input.price;
    if (input.stock !== undefined) product.stock = input.stock;

    return product;
  }

  updateStock(id: number, newStock: number): Product | undefined {
    const product = this.findById(id);
    if (!product) return undefined;
    product.stock = newStock;
    return product;
  }

  remove(id: number): Product | undefined {
    const product = this.findById(id);
    if (!product) return undefined;
    this.products = this.products.filter((p) => p.id !== id);
    return product;
  }
}