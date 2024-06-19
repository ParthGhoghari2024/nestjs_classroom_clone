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
  Inject,
  forwardRef,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { registerDto } from './dto/register.dto';
import argon2 from 'argon2';
import generalJsonResponse from 'src/helper/generalResponse.helper';
import { User } from '../users/entities/user.entity';
import { IRegisterAvailabity } from 'src/types/interface';
import { ClassesService } from '../classes/classes.service';
import { RegisterTeacherAndAddToClass } from './dto/registerTeacherAddToClass.dto';
import { Response } from 'express';

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

    @Inject(forwardRef(() => ClassesService))
    private readonly classesServices: ClassesService,
  ) {}

  private readonly logger = new Logger(AuthController.name);
  private readonly SALT = process.env.SALT;
  @Post('/login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Post('/register')
  async register(@Body() registerDto: registerDto, @Res() res) {
    try {
      const checkAvailabity: boolean | Response =
        await this.returnResponseIfNotAvailable(registerDto, res);

      if (checkAvailabity !== true) {
        return;
      }

      const hashedpassword: string = await argon2.hash(registerDto.password, {
        secret: Buffer.from(this.SALT),
      });
      registerDto.password = hashedpassword;

      const registerResult: User = await this.authService.register(registerDto);

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

  @Post('/register/teacher/addToClass')
  async registerTeacherAndAddToClass(
    @Body() registerTeacherAndAddToClass: RegisterTeacherAndAddToClass,
    @Res() res: Response,
  ) {
    try {
      const checkAvailabity: boolean | Response =
        await this.returnResponseIfNotAvailable(
          registerTeacherAndAddToClass,
          res,
        );

      if (checkAvailabity !== true) {
        return;
      }

      const registerTeacherAndAddToClassResult =
        await this.classesServices.createTeacherAddToClass(
          registerTeacherAndAddToClass,
        );

      if (registerTeacherAndAddToClassResult === false) {
        return generalJsonResponse(
          res,
          { success: 0, UIdError: 1 },
          'Some UIds are wrong ',
          'error',
          false,
          403,
        );
      }

      if (
        registerTeacherAndAddToClassResult &&
        registerTeacherAndAddToClassResult.length > 0
      )
        return generalJsonResponse(res, { success: 1 });
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

  async returnResponseIfNotAvailable(
    registerDto: registerDto,
    @Res() res: Response,
  ) {
    try {
      if (registerDto.password !== registerDto.confirmPassword) {
        return generalJsonResponse(
          res,
          { success: 0, confirmPasswordErr: 1 },
          'Password and confirm password mismatched',
          'error',
          false,
          403,
        );
      }

      const registerAvailabity: IRegisterAvailabity =
        await this.authService.checkAvailabity(
          registerDto.username,
          registerDto.email,
        );

      const response = {
        success: 0,
      };

      if (registerAvailabity.emailAvailabity === 0) {
        response['emailError'] = 1;
      }
      if (registerAvailabity.usernameAvailabity === 0) {
        response['usernameError'] = 1;
      }

      if (
        registerAvailabity.emailAvailabity === 0 ||
        registerAvailabity.usernameAvailabity === 0
      ) {
        return generalJsonResponse(res, response, '', 'error', false, 403);
      }

      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
