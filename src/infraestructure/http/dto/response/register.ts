import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserDto } from '../user';
import { BaseResponseHttp } from './base';

export class RegisterResponseDto extends BaseResponseHttp {
  @ApiProperty({
    type: UserDto,
    description: 'User data',
  })
  @Type(() => UserDto)
  data: UserDto;
}
