import { IsOptional, IsNumber } from 'class-validator';

export class CreateIntermediateDto {
  @IsOptional()
  @IsNumber()
  brand_id?: number;

  @IsOptional()
  @IsNumber()
  category_id?: number;
}
