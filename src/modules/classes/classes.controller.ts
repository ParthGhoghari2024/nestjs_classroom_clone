import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Logger,
  RequestMapping,
  UseGuards,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/createClass.dto';
import { UpdateClassDto } from './dto/updateClass.dto';
import { Class } from './entities/class.entity';
import generalJsonResponse from 'src/helper/generalResponse.helper';
import { TeacherClasses } from '../teacherClass/entities/teacherClass.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddClassWithAssignments } from './dto/addClassWithAssignments.dto';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateResult } from 'typeorm';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('class')
@Controller('class')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  private logger = new Logger(ClassesController.name);
  @Post()
  @ApiOperation({ summary: 'Create class' })
  async create(@Body() createClassDto: CreateClassDto) {
    return await this.classesService.create(createClassDto);
  }

  @Get()
  async findAll() {
    return await this.classesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find class by id' })
  @ApiResponse({
    status: 200,
    description: 'Found class data',
    type: Class,
  })
  async findOne(@Param('id') id: string) {
    return await this.classesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update class by id' })
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
    @Res() res: Response,
  ) {
    try {
      const updateResult: UpdateResult = await this.classesService.update(
        +id,
        updateClassDto,
      );

      if (updateResult) return generalJsonResponse(res, { success: 1 });
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
      return generalJsonResponse(res, { success: 0 }, '', 'error', false, 500);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const deleteResult: UpdateResult = await this.classesService.remove(+id);

      if (deleteResult) return generalJsonResponse(res, { success: 1 });
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
      return generalJsonResponse(res, { success: 0 }, '', 'error', false, 500);
    }
  }

  @Post('/restore/:id')
  async restoreClass(@Param('id') id: string, @Res() res) {
    try {
      const classId: number = Number(id);
      const restoreResult = await this.classesService.restore(classId);

      if (restoreResult) return generalJsonResponse(res, { success: 1 });
      else generalJsonResponse(res, { success: 0 }, '', 'error', false, 400);
    } catch (error) {
      this.logger.error(error);
      generalJsonResponse(res, { success: 0 }, '', 'error', false, 500);
    }
  }

  @Post('/teacher/:id')
  async addTeacherToClass(@Param('id') id: string, @Res() res) {
    try {
      const classId: number = Number(id);
      const userId: number = 1; //TODO:
      const createResult = await this.classesService.addTeacherToClass(
        classId,
        userId,
      );

      if (createResult) return generalJsonResponse(res, { success: 1 });
      else
        return generalJsonResponse(
          res,
          { success: 0 },
          '',
          'error',
          false,
          500,
        );
    } catch (error) {
      this.logger.error(error);
      return generalJsonResponse(res, { success: 1 }, '', 'error', false, 500);
    }
  }

  @Post('/student/:id')
  async addStudentToClass(@Param('id') id: string, @Res() res) {
    try {
      const classId: number = Number(id);
      const userId: number = 1; //TODO:
      const createResult = await this.classesService.addStudentToClass(
        classId,
        userId,
      );

      if (createResult) return generalJsonResponse(res, { success: 1 });
      else
        return generalJsonResponse(
          res,
          { success: 0 },
          '',
          'error',
          false,
          500,
        );
    } catch (error) {
      this.logger.error(error);
      return generalJsonResponse(res, { success: 1 }, '', 'error', false, 500);
    }
  }

  @Post('/assignments')
  @ApiOperation({ summary: 'Create class with assignments' })
  async addClassWithAssignments(
    @Body() addClassWithAssignments: AddClassWithAssignments,
    @Res() res: Response,
  ) {
    try {
      const userId: number = 1;
      const createResult = await this.classesService.addClassWithAssignments(
        addClassWithAssignments,
        userId,
      );
      if (createResult) return generalJsonResponse(res, { success: 1 });
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
      return generalJsonResponse(res, { success: 0 }, '', 'error', false, 500);
    }
  }
}
