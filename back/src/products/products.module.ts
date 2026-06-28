import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { PRODUCTS_REPOSITORY } from './repositories/products.repository';
import { TypeOrmProductsRepository } from './repositories/typeorm-products.repository'; 
import { ProductEntity } from './entities/product.entity'; 
import { CategoriesModule } from '../categories/categories.module'; 

@Module({
  imports: [
    forwardRef(() => CategoriesModule),
    TypeOrmModule.forFeature([ProductEntity]) 
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    { 
      provide: PRODUCTS_REPOSITORY, 
      useClass: TypeOrmProductsRepository 
    },
  ],
  exports: [ProductsService, PRODUCTS_REPOSITORY],
})
export class ProductsModule {}