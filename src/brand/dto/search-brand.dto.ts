import {
  IsBoolean,
  IsString,
  IsOptional,
  ArrayNotEmpty,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { NoQueryDeliveredException } from 'src/exceptions/custom-exception';

export class SearchBrandDto {
  @IsString({ each: true })
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true }) // 각 요소에 대해 검증
  @Transform(({ value }) => {
    if (value.includes('undefined') || value.includes('null')) {
      throw new NoQueryDeliveredException();
    }
    return value;
  })
  brand_name: string[];

  @IsOptional() // null이나 undefined인 경우, 다른 유효성 검사 통과
  @IsBoolean()
  // 'true' 또는 'false' 문자열인 경우에만 해당 값을 boolean으로 변환, 그 외의 경우는 변환하지 않음
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  category?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  product?: boolean;
}
