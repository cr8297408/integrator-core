import { ApiProperty } from '@nestjs/swagger';
import { type IResponseDataHttp, Status } from '../../model/response';
import { type IResponseDataHttpList } from '../../model/response-list';

export class BaseResponseHttp implements Omit<IResponseDataHttp<unknown>, 'data'> {
  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: {
      code: 200,
      message: 'Success',
    },
    description: 'Indicates the status code of the request and a success message',
  })
  status: Status;
}

export class BaseResponseHttpListDto implements Omit<IResponseDataHttpList<unknown>, 'data'> {
  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: {
      code: 200,
      message: 'Success',
    },
    description: 'Indicates the status code of the request and a success message',
  })
  status: Status;

  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'The current page number',
  })
  currentPage: number;

  @ApiProperty({
    type: 'number',
    example: 10,
    description: 'The total number of items',
  })
  totalItems: number;

  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'The total number of pages',
  })
  totalPages: number;
}
