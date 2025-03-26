import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, IsDate } from 'class-validator';
import { User } from 'src/core/domain/entities/user';

export class UserDto implements Omit<User, 'password'> {
  @IsUUID('4', { message: 'id must be a valid UUID V4' })
  @ApiProperty({
    type: 'string',
    description: 'Unique identifier of the user.',
    example: 'a3f23b34-6d91-4b9b-9a1c-2f4e3f9b8e7d',
  })
  id: string;

  @IsEmail({}, { message: 'email must be a valid email address' })
  @ApiProperty({
    type: 'string',
    description: 'User email address.',
    example: 'user@example.com',
  })
  email: string;

  @IsString({ message: 'fullName must be a string' })
  @ApiProperty({
    type: 'string',
    description: 'Full name of the user.',
    example: 'John Doe',
  })
  fullName: string;

  @IsDate({ message: 'createdAt must be a valid date' })
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Date when the user was created.',
    example: '2024-03-25T12:34:56.789Z',
  })
  createdAt: Date;

  @IsDate({ message: 'updatedAt must be a valid date' })
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Date when the user was last updated.',
    example: '2024-03-26T15:20:30.123Z',
  })
  updatedAt: Date;
}
