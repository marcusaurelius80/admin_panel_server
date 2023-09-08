import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandService } from './brand.service';

import { Brand } from './entities/brand.entity';
import { Category } from 'src/category/entities/category.entity';
import { Intermediate } from 'src/intermediate.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Category, Intermediate, Product])],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
