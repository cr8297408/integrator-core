import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthRegisterUserInformation } from '../../../core/domain/ports/auth-service';

export class AuthRegisterUserInformationDto implements AuthRegisterUserInformation {
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

  @IsString({ message: 'fullName must be a string' })
  @ApiProperty({
    type: 'string',
    description: 'Full name of the user.',
    example: 'John Doe',
  })
  fullName: string;
}
