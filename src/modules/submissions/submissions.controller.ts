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
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/createSubmission.dto';
import { UpdateSubmissionDto } from './dto/updateSubmission.dto';
import generalJsonResponse from 'src/helper/generalResponse.helper';
import { Submission } from './entities/submission.entity';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multerOptions.utils';
import { UploadSubmissionDto } from './dto/uploadSubmission.dto';
import { CreateAttachementsEntityDto } from '../attachementsEntity/dto/createAttachementsEntity.dto';
import { Response } from 'express';
@ApiBearerAuth()
@ApiTags('submissions')
@UseGuards(AuthGuard)
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  private readonly logger = new Logger(SubmissionsService.name);

  @Post()
  async create(@Body() createSubmissionDto: CreateSubmissionDto, @Res() res) {
    try {
      const studentId: number = 1; //TODO:
      const createResult: Submission = await this.submissionsService.create(
        createSubmissionDto,
        studentId,
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

  @Get()
  async findAll() {
    return await this.submissionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const submission: Submission = await this.submissionsService.findOne(+id);

      if (submission)
        return generalJsonResponse(res, { success: 1, result: submission });
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

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateSubmissionDto: UpdateSubmissionDto,
  // ) {
  //   return await this.submissionsService.update(+id, updateSubmissionDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    try {
      const removeResult: UpdateResult =
        await this.submissionsService.remove(+id);

      if (removeResult) return generalJsonResponse(res, { success: 1 });
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
  async restore(@Param('id') id: string, @Res() res) {
    try {
      const restoreResult: UpdateResult =
        await this.submissionsService.restore(+id);

      if (restoreResult) return generalJsonResponse(res, { success: 1 });
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
    @Body() uploadSubmissionDto: UploadSubmissionDto,
    @Res() res: Response,
  ) {
    try {
      const userId: number = 1; //TODO:

      const attachementsFileDetailArray: CreateAttachementsEntityDto[] = [];
      files &&
        files.files &&
        files.files.forEach((file: Express.Multer.File) => {
          const attachementsFileDetail: CreateAttachementsEntityDto = {
            attachmentId: uploadSubmissionDto.submissionId,
            attachmentType: 'submission',
            original_filename: file.originalname,
            new_filename: file.filename,
            path: file.path,
          };

          attachementsFileDetailArray.push(attachementsFileDetail);
        });

      const createAttachementsMetaData =
        await this.submissionsService.addAttachementMetadata(
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

  @Get('/submission/metadata/:id')
  async getAttachementFile(@Param('id') id: string, @Res() res) {
    try {
      const attachementMetaData: Submission =
        await this.submissionsService.getAttachementMetadata(+id);

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
