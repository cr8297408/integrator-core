import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "../user";
import { BaseResponseHttp } from "./base";
import { Type } from "class-transformer";

export class RegisterResponseDto extends BaseResponseHttp {
    @ApiProperty({
        type: UserDto,
        description: 'User data',
    })
    @Type(() => UserDto)
    data: UserDto;
}