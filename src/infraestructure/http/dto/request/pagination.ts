import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString } from "class-validator";
import { PaginationInput } from "src/core/domain/ports/product-service";

export class PaginationInputDto implements PaginationInput {
    @IsNumberString()
    @ApiProperty(
        {
            description: 'Limit of products to return',
            example: 10,
            type: Number
        }
    )
    limit: number;
    @IsNumberString()
    @ApiProperty(
        {
            description: 'Number of products to skip',
            example: 0,
            type: Number
        }
    )
    skip: number;    
    
}