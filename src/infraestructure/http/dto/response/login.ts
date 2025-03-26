import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { type AuthLoginResponse } from 'src/core/domain/ports/auth-service';
import { UserDto } from '../user';
import { BaseResponseHttp } from './base';

export class LoginDataResponseDto implements AuthLoginResponse {
  @ApiProperty({
    type: 'string',
    description: 'User token',
  })
  token: string;

  @ApiProperty({
    type: UserDto,
    description: 'User data',
  })
  @Type(() => UserDto)
  user: UserDto;
}

export class LoginResponseDto extends BaseResponseHttp {
  @ApiProperty({
    type: LoginDataResponseDto,
    description: 'User data',
  })
  @Type(() => LoginDataResponseDto)
  data: LoginDataResponseDto;
}
