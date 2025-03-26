import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { Product, ProductStatus } from 'src/core/domain/entities/product';
import { User } from 'src/core/domain/entities/user';

export class ProductDto implements Product {
  @IsString({ message: 'id must be a string' })
  @ApiProperty({
    type: 'string',
    description: 'Unique identifier of the product.',
    example: '67e3829a762b27295c568b46',
  })
  _id: string;

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

  @IsUUID('4', { message: 'ownerId must be a valid UUID V4' })
  @ApiProperty({
    type: 'string',
    description: 'UUID of the owner of the product.',
    example: 'b7f1f2b8-4c5d-9e1a-6b3c2d4e5f6a',
  })
  ownerId: string;

  @ApiProperty({
    type: () => User,
    description: 'Owner of the product.',
  })
  owner: User;

  @IsBoolean({ message: 'isValidated must be a boolean' })
  @ApiProperty({
    type: 'boolean',
    description: 'Indicates if the product has been validated.',
    example: true,
  })
  isValidated: boolean;

  @IsEnum(ProductStatus, { message: 'status must be a valid ProductStatus' })
  @ApiProperty({
    enum: ProductStatus,
    description: 'Current status of the product.',
    example: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @ApiProperty({
    type: 'string',
    description: 'Date when the product was created.',
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
