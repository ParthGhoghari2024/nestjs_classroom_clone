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
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './entities/class.entity';
import generalJsonResponse from 'src/helper/generalResponse.helper';
import e from 'express';
import { TeacherClasses } from '../teacherClass/entities/teacherClass.entity';

@Controller('class')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  private logger = new Logger(ClassesController.name);
  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(+id, updateClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.remove(+id);
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
}
