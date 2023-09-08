import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import {
  IsNumber,
  IsString,
  IsBoolean,
  IsPositive,
  IsOptional,
} from 'class-validator';

export class RemoveProductDto extends PartialType(CreateProductDto) {
  @IsOptional() // 얘를 통해 값을 반드시 넣을 필요 없게 했다
  @IsNumber()
  product_id: number;

  @IsOptional()
  @IsString()
  product_name: string;

  @IsOptional()
  @IsNumber()
  brand_id: number;

  @IsOptional()
  @IsNumber()
  category_id: number;

  @IsOptional()
  @IsString()
  sex: string;

  @IsOptional()
  @IsBoolean()
  is_kids: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  sales_quantity: number;
}
