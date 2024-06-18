import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { registerDto } from './dto/register.dto';
import argon2 from 'argon2';
import generalJsonResponse from 'src/helper/generalResponse.helper';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private readonly logger = new Logger(AuthController.name);
  private readonly SALT = process.env.SALT;
  @Post('/login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Post('/register')
  async register(@Body() registerDto: registerDto, @Res() res) {
    try {
      const hashedpassword: string = await argon2.hash(registerDto.password, {
        secret: Buffer.from(this.SALT),
      });

      registerDto.password = hashedpassword;

      const registerResult = await this.authService.register(registerDto);

      if (registerResult) return generalJsonResponse(res, { success: 1 });
      else
        return generalJsonResponse(
          res,
          { success: 0 },
          '',
          'error',
          false,
          400,
        );
    } catch (error) {
      this.logger.error(error);
      generalJsonResponse(res, { success: 0 }, '', 'error', false, 500);
    }
  }
}
