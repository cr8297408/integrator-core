import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthServiceAdapter } from '../../adapters/auth-service';
import { AuthLoginUserInformationDto } from '../dto/request/login';
import { AuthRegisterUserInformationDto } from '../dto/request/register';
import { LoginResponseDto } from '../dto/response/login';
import { RegisterResponseDto } from '../dto/response/register';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthServiceAdapter) {}

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
    type: RegisterResponseDto,
  })
  async register(@Body() user: AuthRegisterUserInformationDto): Promise<RegisterResponseDto> {
    const userCreated = await this.authService.register(user);

    return {
      data: userCreated,
      status: {
        code: HttpStatus.CREATED,
        message: 'User registered successfully',
      },
    };
  }

  @Post('login')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
    type: LoginResponseDto,
  })
  async login(@Body() user: AuthLoginUserInformationDto): Promise<LoginResponseDto> {
    const loginInformation = await this.authService.login(user);
    return {
      data: loginInformation,
      status: {
        code: HttpStatus.OK,
        message: 'User logged in successfully',
      },
    };
  }
}
