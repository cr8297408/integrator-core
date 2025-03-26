import { AuthLoginUserInformation } from "src/core/domain/ports/auth-service";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class AuthLoginUserInformationDto implements AuthLoginUserInformation {
    @IsEmail({}, { message: 'email must be a valid email address' })
    @ApiProperty({
        type: 'string',
        description: 'User email address used for authentication.',
        example: 'user@example.com',
    })
    email: string;

    @IsString({ message: 'password must be a string' })
    @MinLength(8, { message: 'password must be at least 8 characters long' })
    @ApiProperty({
        type: 'string',
        description: 'User password with a minimum length of 8 characters.',
        example: 'securePass123',
    })
    password: string;
}