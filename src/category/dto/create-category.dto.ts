import {
  IsDefined,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  category_name: string;

  @IsOptional()
  @IsNumber({}, { each: true }) // 각 요소에 대해 숫자 검증
  @IsArray()
  brand_ids?: number[];
}
