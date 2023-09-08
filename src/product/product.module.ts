import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { CategoryService } from 'src/category/category.service';
import { BrandService } from 'src/brand/brand.service';

import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { Intermediate } from 'src/intermediate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Intermediate, Brand, Category])],
  controllers: [ProductController],
  providers: [ProductService, BrandService, CategoryService],
})
export class ProductModule {}
