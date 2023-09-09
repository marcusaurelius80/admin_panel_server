import {
  IsNumber,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Min,
  IsObject,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  product_name: string;

  @Type(() => Number) // 클라이언트에서 FormData()로 넘어왔기 때문에 모든 데이터가 string 형식
  @IsOptional()
  @IsNumber()
  brand_id?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  category_id?: number;

  @IsNotEmpty()
  @IsString()
  sex: string;

  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  is_kids: boolean;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  sales_quantity: number;

  @Type(() => File)
  @IsOptional()
  @IsObject()
  imgs?: File[];
}
