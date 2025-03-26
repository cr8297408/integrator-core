import { Product } from "src/core/domain/entities/product";
import { BaseResponseHttp } from "./base";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductResponseDto extends BaseResponseHttp {
    @ApiProperty({
        type: Product,
        description: 'Created product',
        example: {
            _id: '60b9b9b9b9b9b9b9b9b9b9b9',
            name: 'Product 1',
            price: 10,
            ownerId: '60b9b9b9b9b9b9b9b9b9b9b9',
            createdAt: '2021-01-01T00:00:00.000Z',
            status: 'active',
            isValidated: false
        }
    })
    @Type(() => Product)
    data: Product;
}