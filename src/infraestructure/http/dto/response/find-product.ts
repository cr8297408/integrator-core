import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseResponseHttp } from './base';
import { ProductDto } from '../product';

export class FindProductResponseDto extends BaseResponseHttp {
  @ApiProperty({
    type: ProductDto,
    description: 'Product.',
  })
  @Type(() => ProductDto)
  data: ProductDto | null;
}
