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
  Req,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/createSubmission.dto';
import { UpdateSubmissionDto } from './dto/updateSubmission.dto';
import generalJsonResponse from 'src/helper/generalResponse.helper';
import { Submission } from './entities/submission.entity';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multerOptions.utils';
import { UploadSubmissionDto } from './dto/uploadSubmission.dto';
import { CreateAttachementsEntityDto } from '../attachementsEntity/dto/createAttachementsEntity.dto';
import { Response, Request } from 'express';
import { AttachmentsEntity } from '../attachementsEntity/entities/attachementsEntity.entity';
import path from 'path';
import AdmZip from 'adm-zip';
import mime from 'mime-type/with-db';
import fs from 'fs';
@ApiBearerAuth()
@ApiTags('submissions')
@UseGuards(AuthGuard)
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  private readonly logger = new Logger(SubmissionsService.name);

  @Post()
  async create(
    @Body() createSubmissionDto: CreateSubmissionDto,
    @Res() res,
  ): Promise<Response> {
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
  async findAll(@Res() res: Response): Promise<Response> {
    try {
      const submissions = await this.submissionsService.findAll();

      if (submissions)
        return generalJsonResponse(res, { success: 1, result: submissions });

      return generalJsonResponse(
        res,
        { success: 0 },
        'Something went wrong',
        'error',
        false,
        400,
      );
    } catch (error) {
      this.logger.error(error);
      return generalJsonResponse(res, { success: 0 }, '', 'error', false, 400);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res): Promise<Response> {
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
  async remove(@Param('id') id: string, @Res() res): Promise<Response> {
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
  async restore(@Param('id') id: string, @Res() res): Promise<Response> {
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        classId: {
          type: 'number',
        },
        submission: {
          type: 'string',
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
      multerOptions('submission'),
    ),
  )
  async upload(
    @UploadedFiles() files,
    @Body() uploadSubmissionDto: UploadSubmissionDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    try {
      const userId: number = req.user.id; //TODO:

      const attachementsFileDetailArray: CreateAttachementsEntityDto[] = [];
      files &&
        files.files &&
        files.files.forEach((file: Express.Multer.File) => {
          const attachementsFileDetail: CreateAttachementsEntityDto = {
            attachmentType: 'submission',
            original_filename: file.originalname,
            new_filename: file.filename,
            path: file.path,
          };

          attachementsFileDetailArray.push(attachementsFileDetail);
        });

      const createAttachementsMetaData: Submission =
        await this.submissionsService.addAttachementMetadata(
          attachementsFileDetailArray,
          uploadSubmissionDto,
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
    }
  }

  @Get('/submission/metadata/:id')
  async getAttachementFileMetaData(
    @Param('id') id: string,
    @Res() res,
  ): Promise<Response> {
    try {
      const attachementMetaData: Submission =
        await this.submissionsService.getAttachementMetaBySubmssionId(+id);

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

  @Get('/attachment/:id')
  async getAttachementFile(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const attachementMetaData: AttachmentsEntity =
        await this.submissionsService.getAttachementMetadataById(+id);

      const filePath: string = path.resolve(
        path.join(attachementMetaData.path),
      );

      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath);
        const fileName = `${attachementMetaData.new_filename}`;
        const fileType = mime.lookup(filePath);
        res.writeHead(200, {
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Type': fileType,
        });
        return res.end(fileData);
      }

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

  @Get('/attachment/zip/:id')
  async getAttachementZip(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const userId: number = req.user.id;
      const attachementMetaData: Submission =
        await this.submissionsService.getSubmissionMetaByUserIdSubmussionId(
          userId,
          +id,
        );

      let attachementPaths: string[] = [];

      if (attachementMetaData) {
        attachementMetaData.attachments.forEach((attachement) => {
          const filePath: string = path.resolve(path.join(attachement.path));

          attachementPaths = [...attachementPaths, filePath];
        });
      }

      if (attachementPaths.length === 0) {
        return generalJsonResponse(
          res,
          { success: 0, noSubmissions: 1 },
          '',
          'error',
          false,
          403,
        );
      }

      let zip: AdmZip = new AdmZip();
      attachementPaths.forEach(async (path: string) => {
        if (fs.existsSync(path)) {
          zip.addLocalFile(path);
        }
      });

      let zipContent: Buffer = await zip.toBufferPromise();

      const fileName = `submission_${id}.zip`;
      const fileType = 'application/zip';
      res.writeHead(200, {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': fileType,
      });
      return res.end(zipContent);
    } catch (error) {
      this.logger.error(error);
      return generalJsonResponse(res, { success: 0 }, '', 'error', false, 500);
    }
  }
}
