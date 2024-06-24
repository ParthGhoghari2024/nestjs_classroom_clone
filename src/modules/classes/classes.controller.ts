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
  Req,
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
import { Response, Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateResult } from 'typeorm';
import { RolesEnum } from 'src/types/constants';
import { IsTeacherGuard } from '../auth/isTeacher.guard';
import { ClassGuard } from './classes.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('class')
@Controller('class')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  private logger: Logger = new Logger(ClassesController.name);

  @UseGuards(IsTeacherGuard)
  @Post()
  @ApiOperation({ summary: 'Create class' })
  async create(
    @Body() createClassDto: CreateClassDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const userId: number = req.user.id;
      const userRole: string = req.user.role;

      if (userRole != RolesEnum.Teacher) {
        return generalJsonResponse(
          res,
          { success: 0, roleError: 1 },
          '',
          'error',
          false,
          400,
        );
      }
      const classEntity: Class = await this.classesService.create(
        createClassDto,
        userId,
      );
      if (classEntity) return generalJsonResponse(res, { success: 1 });
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
      return generalJsonResponse(res, { success: 0 }, '', 'error', false, 400);
    }
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

  @UseGuards(ClassGuard)
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

  @UseGuards(ClassGuard)  
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const deleteResult: Class = await this.classesService.remove(+id);

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

  @UseGuards(ClassGuard)
  @Post('/restore/:id')
  async restoreClass(@Param('id') id: string, @Res() res) {
    try {
      const classId: number = Number(id);
      const restoreResult: Class = await this.classesService.restore(classId);

      if (restoreResult) return generalJsonResponse(res, { success: 1 });
      else generalJsonResponse(res, { success: 0 }, '', 'error', false, 400);
    } catch (error) {
      this.logger.error(error);
      generalJsonResponse(res, { success: 0 }, '', 'error', false, 500);
    }
  }

  @Post('/teacher/:id')
  async addTeacherToClass(@Param('id') id: string, @Res() res, @Req() req) {
    try {
      const classId: number = Number(id);
      const userId: number = req.user.id || 1; //TODO:
      const createResult: Class = await this.classesService.addTeacherToClass(
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
  async addStudentToClass(@Param('id') id: string, @Res() res, @Req() req) {
    try {
      const classId: number = Number(id);
      const userId: number = req.user.id || 1; //TODO:
      const createResult: Class = await this.classesService.addStudentToClass(
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
    @Req() req: Request,
  ) {
    try {
      const userId: number = req.user.id || 1;
      const createResult: Class =
        await this.classesService.addClassWithAssignments(
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
