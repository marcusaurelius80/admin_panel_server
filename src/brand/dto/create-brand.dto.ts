import {
  IsDefined,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  brand_name: string;

  @IsOptional()
  @IsNumber({}, { each: true }) // 각 요소에 대해 숫자 검증
  @IsArray()
  category_ids?: number[];
}
