import { Module, forwardRef } from '@nestjs/common';
import { CategoriesController } from './controllers/categories.controller';
import { CATEGORIES_REPOSITORY } from './repositories/categories.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { TypeOrmCategoriesRepository } from './repositories/typeorm-categories.repository';
import { CategoriesService } from './services/categories.service';
import { ProductEntity } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, ProductEntity])],
  providers: [
    CategoriesService,
    { 
      provide: CATEGORIES_REPOSITORY, 
      useClass: TypeOrmCategoriesRepository 
    },
  ],
  exports: [CATEGORIES_REPOSITORY],
  controllers: [CategoriesController],
})
export class CategoriesModule {}