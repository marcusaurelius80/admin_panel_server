import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RemoveProductDto } from './dto/remove-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.options';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('imgs', 3, multerOptions))
  async create(
    @UploadedFiles() imgs: Express.Multer.File[],
    @Body() data: CreateProductDto,
  ) {
    return this.productService.create(imgs, data);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('search')
  search(@Query() query: SearchProductDto) {
    return this.productService.lookUp(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete()
  remove(@Body() removeProductDto: RemoveProductDto) {
    return this.productService.remove(removeProductDto);
  }
}
