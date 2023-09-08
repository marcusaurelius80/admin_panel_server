import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './orm.config';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { FilesModule } from './files/files.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './exceptions/exception.filter';

@Module({
  imports: [
    BrandModule,
    CategoryModule,
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    ProductModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionFilter },
  ],
})
export class AppModule {}
