import { type HttpStatus } from '@nestjs/common';

export interface IResponseDataHttp<T> {
  status: Status;
  data: T;
}

export interface Status {
  code: HttpStatus;
  message: string;
}
