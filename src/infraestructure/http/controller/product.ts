import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ProductServiceAdapter } from 'src/infraestructure/adapters/product-service';
import { CurrentUser } from '../decorators/current-user';
import { CreateProductDto } from '../dto/request/CreateProductDto';
import { PaginationInputDto } from '../dto/request/pagination';
import { UpdateProductDto } from '../dto/request/UpdateProductDto';
import { CreateProductResponseDto } from '../dto/response/create-response';
import { type FindAllProductsResponseDto } from '../dto/response/find-all-products';
import { FindProductResponseDto } from '../dto/response/find-product';
import { JwtAuthGuard } from '../interceptors/auth-guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductServiceAdapter) {}

  @Get('list')
  async findAll(@CurrentUser() user, @Query() body: PaginationInputDto): Promise<FindAllProductsResponseDto> {
    const products = await this.productService.findAll(body, user.id);
    return {
      status: {
        code: HttpStatus.OK,
        message: 'Products found successfully',
      },
      data: products.data,
      currentPage: products.currentPage,
      totalItems: products.totalItems ?? 0,
      totalPages: products.totalPages,
    };
  }

  @Post('create')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
    type: CreateProductResponseDto,
  })
  async create(@CurrentUser() user, @Body() body: CreateProductDto): Promise<CreateProductResponseDto> {
    const product = await this.productService.create(body, user.id);
    return {
      status: {
        code: HttpStatus.CREATED,
        message: 'Product created successfully',
      },
      data: product,
    };
  }

  @Get('find/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product found successfully',
    type: FindProductResponseDto,
  })
  async findOne(@CurrentUser() user, @Param('id') id: string): Promise<FindProductResponseDto> {
    console.log('id', user.id);
    const product = await this.productService.findById(id, user.id);
    return {
      status: {
        code: HttpStatus.OK,
        message: 'Product found successfully',
      },
      data: product,
    };
  }

  @Put('update/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully',
    type: FindProductResponseDto,
  })
  async update(@CurrentUser() user, @Body() body: UpdateProductDto): Promise<FindProductResponseDto> {
    const product = await this.productService.update(body, user.id);
    return {
      status: {
        code: HttpStatus.OK,
        message: 'Product updated successfully',
      },
      data: product,
    };
  }

  @Delete('delete/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product deleted successfully',
  })
  async delete(@CurrentUser() user, @Param('id') id: string): Promise<void> {
    await this.productService.delete(id, user.id);
  }
}
