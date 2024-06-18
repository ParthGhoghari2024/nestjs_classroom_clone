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
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './entities/class.entity';
import generalJsonResponse from 'src/helper/generalResponse.helper';
import { TeacherClasses } from '../teacherClass/entities/teacherClass.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.classesService.update(+id, updateClassDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.classesService.remove(+id);
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
}
