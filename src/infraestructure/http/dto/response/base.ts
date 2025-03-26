import { ApiProperty } from "@nestjs/swagger";
import { IResponseDataHttp, Status } from "../../model/response";

export class BaseResponseHttp  implements Omit<IResponseDataHttp<unknown>, 'data'> {
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
  