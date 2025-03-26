import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseResponseHttpListDto } from './base';
import { ProductDto } from '../product';

export class FindAllProductsResponseDto extends BaseResponseHttpListDto {
  @ApiProperty({
    type: [ProductDto],
    description: 'List of products.',
  })
  @Type(() => ProductDto)
  data: ProductDto[];
}
