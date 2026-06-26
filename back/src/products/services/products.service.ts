import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import {
  PRODUCTS_REPOSITORY,
  ProductsRepository,
} from '../repositories/products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}

  findAll(name?: string, orderBy?: 'price' | 'name', order?: 'asc' | 'desc'): Product[] {
    return this.productsRepository.findAll(name, orderBy, order);
  }

  findOne(id: number): Product {
    const product = this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(input: CreateProductInput): Product {
    return this.productsRepository.create(input);
  }

  update(id: number, input: UpdateProductInput): Product {
    const product = this.productsRepository.update(id, input);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  remove(id: number): Product {
    const product = this.productsRepository.remove(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  updateStock(id: number, quantity: number): Product {
    const product = this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    
    if (quantity > product.stock) {
      throw new BadRequestException('Stock insuficiente');
    }

    const updatedProduct = this.productsRepository.updateStock(id, product.stock - quantity);
    
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    return updatedProduct;
  }
}

