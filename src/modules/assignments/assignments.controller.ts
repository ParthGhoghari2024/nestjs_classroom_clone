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

@Controller('assignment')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  private readonly logger: Logger = new Logger(AssignmentsController.name);
  @Post()
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    const userId: number = 1; //TODO:
    createAssignmentDto.dueDate = new Date(createAssignmentDto.dueDate);
    return this.assignmentsService.create(createAssignmentDto, userId);
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
  update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(+id, updateAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(+id);
  }

  @Post('/upload/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'files',
          maxCount: 10,
        },
      ],
      multerOptions,
    ),
  )
  async upload(
    @UploadedFiles() files,
    @Body() uploadAssignmentDto: UploadAssignmentDto,
    @Res() res: Response,
  ) {
    try {
      const userId: number = 1; //TODO:

      const attachementsFileDetailArray: CreateAttachementsEntityDto[] = [];
      files &&
        files.files &&
        files.files.forEach((file: Express.Multer.File) => {
          const attachementsFileDetail: CreateAttachementsEntityDto = {
            attachmentId: uploadAssignmentDto.assignmentId,
            attachmentType: 'assignment',
            original_filename: file.originalname,
            new_filename: file.filename,
            path: file.path,
          };

          attachementsFileDetailArray.push(attachementsFileDetail);
        });

      const createAttachementsMetaData =
        await this.assignmentsService.addAttachementMetadata(
          attachementsFileDetailArray,
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
    }
  }

  @Get('/attachment/metadata/:id')
  async getAttachementFile(@Param('id') id: string, @Res() res) {
    try {
      const attachementMetaData =
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
}
