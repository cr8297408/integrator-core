import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { type Product } from 'src/core/domain/entities/product';

export class CreateProductDto implements Pick<Product, 'name' | 'price'> {
  @IsString({ message: 'name must be a string' })
  @ApiProperty({
    type: 'string',
    description: 'Name of the product.',
    example: 'Gaming Laptop',
  })
  name: string;

  @IsNumber({}, { message: 'price must be a number' })
  @ApiProperty({
    type: 'number',
    description: 'Price of the product.',
    example: 1299.99,
  })
  price: number;
}
