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
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import generalResponse from 'src/helper/generalResponse.helper';
import generalJsonResponse from 'src/helper/generalResponse.helper';
import { UpdateResult } from 'typeorm';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('user')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const users = await this.usersService.findAll();

      return generalJsonResponse(res, users);
    } catch (error) {
      this.logger.error(error);
      return generalJsonResponse(res, { success: 0 }, '', 'error', false, 500);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }

  @Post('restore/:id')
  async restore(@Param('id') id: string, @Res() res: Response) {
    try {
      const queryId: number = Number(id);
      const restoreResult: UpdateResult =
        await this.usersService.restore(queryId);

      if (restoreResult) {
        return generalJsonResponse(res, { success: 1 });
      } else {
        return generalJsonResponse(
          res,
          { success: 0 },
          '',
          'error',
          false,
          500,
        );
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
