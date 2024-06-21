import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Injectable,
  Res,
  Logger,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/createAssignment.dto';
import { UpdateAssignmentDto } from './dto/updateAssignment.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multerOptions.utils';
import { CreateAttachementsEntityDto } from '../attachementsEntity/dto/createAttachementsEntity.dto';
import { UploadAssignmentDto } from './dto/uploadAssignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AttachementsEntityService } from '../attachementsEntity/attachementsEntity.service';
import { AttachmentsEntity } from '../attachementsEntity/entities/attachementsEntity.entity';
import generalJsonResponse from 'src/helper/generalResponse.helper';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Assignment } from './entities/assignment.entity';
import { ClassesService } from '../classes/classes.service';
import { UpdateResult } from 'typeorm';
import { RolesEnum } from 'src/types/constants';
import { Class } from '../classes/entities/class.entity';
import { Request } from 'express';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('assignment')
@Controller('assignment')
export class AssignmentsController {
  constructor(
    private readonly assignmentsService: AssignmentsService,

    private readonly classesService: ClassesService,
  ) {}

  private readonly logger: Logger = new Logger(AssignmentsController.name);
  @Post()
  @ApiOperation({ summary: 'post assignments' })
  async create(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const userId: number = req.user.id || 1; //TODO:

      const userRole: string = req.user.role;

      if (userRole != RolesEnum.Teacher) {
        return generalJsonResponse(
          res,
          { success: 0, roleError: 1 },
          '',
          'error',
          false,
          403,
        );
      }

      const classExists: Class = await this.classesService.getClassIdIfExists(
        createAssignmentDto.classId,
      );

      if (!classExists || !classExists.id) {
        return generalJsonResponse(res, { success: 0, classIdError: 1 });
      }
      createAssignmentDto.dueDate = new Date(createAssignmentDto.dueDate);
      const assignment = await this.assignmentsService.create(
        createAssignmentDto,
        userId,
      );

      if (assignment) return generalJsonResponse(res, { success: 1 });
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

  @Get()
  findAll() {
    return this.assignmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
    @Res() res,
  ) {
    try {
      const updateResult: UpdateResult = await this.assignmentsService.update(
        +id,
        updateAssignmentDto,
      );

      if (updateResult && updateResult.affected !== 0)
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
      return generalJsonResponse(res, { success: 0 }, '', 'error', false, 500);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const deleteResult: UpdateResult =
        await this.assignmentsService.remove(+id);

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

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        classId: {
          type: 'number',
        },
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        dueDate: {
          type: 'date',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Post('/upload/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'files',
          maxCount: 10,
        },
      ],
      multerOptions('assignment'),
    ),
  )
  async upload(
    @UploadedFiles() files,
    @Body() uploadAssignmentDto: UploadAssignmentDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const userId: number = req.user.id || 1; //TODO:

      const attachementsFileDetailArray: CreateAttachementsEntityDto[] = [];
      files &&
        files.files &&
        files.files.forEach((file: Express.Multer.File) => {
          const attachementsFileDetail: CreateAttachementsEntityDto = {
            // attachmentId: uploadAssignmentDto.assignmentId,
            attachmentType: 'assignment',
            original_filename: file.originalname,
            new_filename: file.filename,
            path: file.path,
          };

          attachementsFileDetailArray.push(attachementsFileDetail);
        });

      const createAttachementsMetaData: Assignment =
        await this.assignmentsService.addAttachementMetadata(
          attachementsFileDetailArray,
          uploadAssignmentDto,
          userId,
        );

      if (createAttachementsMetaData)
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
      return generalJsonResponse(res, { success: 0 }, '', 'error', false, 500);
    }
  }

  @Get('/attachment/metadata/:id')
  async getAttachementFile(@Param('id') id: string, @Res() res) {
    try {
      const attachementMetaData: Assignment =
        await this.assignmentsService.getAttachementMetadata(+id);

      if (attachementMetaData)
        return generalJsonResponse(res, {
          success: 1,
          result: attachementMetaData,
        });
      return generalJsonResponse(
        res,
        { success: 0 },
        'something went wrong',
        'error',
        false,
        400,
      );
    } catch (error) {
      this.logger.error(error);
      return generalJsonResponse(res, { success: 0 }, '', 'error', false, 500);
    }
  }

  @Delete('/attachment/:id')
  async removeAttachementFile(
    // @Param('assignementId') assignementId: string,
    @Param('id') id: string,
    @Res() res,
  ) {
    try {
      const attachement: AttachmentsEntity =
        await this.assignmentsService.getAttachementByAttachementId(+id);

      if (!attachement) {
        return generalJsonResponse(res, { success: 0, attachementError: 1 });
      }

      if (
        !attachement.assignmentAttachment ||
        !attachement.assignmentAttachment.id
      ) {
        return generalJsonResponse(res, { success: 0, assignementError: 1 });
      }

      const deleteResult: UpdateResult =
        await this.assignmentsService.removeAttachement(+id);
      if (deleteResult)
        return generalJsonResponse(res, {
          success: 1,
        });
      return generalJsonResponse(
        res,
        { success: 0 },
        'something went wrong',
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
