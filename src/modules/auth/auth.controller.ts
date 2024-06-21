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
import { LoginDto } from './dto/loginAuth.dto';
import { UpdateAuthDto } from './dto/updateAuth.dto';
import { registerDto } from './dto/register.dto';
import argon2 from 'argon2';
import generalJsonResponse from 'src/helper/generalResponse.helper';
import { User } from '../users/entities/user.entity';
import { IRegisterAvailabity } from 'src/types/interface';
import { ClassesService } from '../classes/classes.service';
import { RegisterTeacherAndAddToClass } from './dto/registerTeacherAddToClass.dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';
import { TeacherClasses } from '../teacherClass/entities/teacherClass.entity';

@Controller('')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

    @Inject(forwardRef(() => ClassesService))
    private readonly classesServices: ClassesService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger: Logger = new Logger(AuthController.name);
  private readonly SALT: string = process.env.SALT;

  @Post('/login')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({
    type: LoginDto,
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userIfRightCredentials: false | User =
      await this.authService.checkCredentials(loginDto);

    if (userIfRightCredentials === false)
      return generalJsonResponse(res, { success: 0, emailPasswordError: 1 });
    const accessToken: string = await this.jwtService.signAsync({
      id: userIfRightCredentials.id,
      username: userIfRightCredentials.username,
      email: userIfRightCredentials.email,
      roleId: userIfRightCredentials.roleId,
    });

    res.cookie('access_token', accessToken);

    res.json({ success: 1, temp: 1, token: accessToken });
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

  @Get('/logout')
  async logout(@Res() res: Response) {
    try {
      return res.clearCookie('access_token').send();
    } catch (error) {
      this.logger.error(error);
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

      const registerTeacherAndAddToClassResult: false | TeacherClasses[] =
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
