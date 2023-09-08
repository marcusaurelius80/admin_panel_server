import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsDefined, IsNumber } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  brand_id?: number;

  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  category_id?: number;
}
