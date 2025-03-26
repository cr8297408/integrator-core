import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger/dist';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { type Product, ProductStatus } from 'src/core/domain/entities/product';

export class UpdateProductDto implements Partial<Product> {
  @IsString({ message: 'id must be a string' })
  @ApiProperty({
    type: 'string',
    description: 'Unique identifier of the product.',
    example: '67e3829a762b27295c568b46',
  })
  _id: string;

  @IsString({ message: 'name must be a string' })
  @ApiPropertyOptional({
    type: 'string',
    description: 'Name of the product.',
    example: 'Gaming Laptop',
  })
  name: string;

  @IsNumber({}, { message: 'price must be a number' })
  @ApiPropertyOptional({
    type: 'number',
    description: 'Price of the product.',
    example: 1299.99,
  })
  price: number;

  @IsEnum(ProductStatus, { message: 'status must be a valid ProductStatus' })
  @ApiPropertyOptional({
    enum: ProductStatus,
    description: 'Current status of the product.',
    example: ProductStatus.ACTIVE,
  })
  status: ProductStatus;
}
