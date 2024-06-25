import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  Res,
  Logger,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/createAssignment.dto';
import { UpdateAssignmentDto } from './dto/updateAssignment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multerOptions.utils';
import { CreateAttachementsEntityDto } from '../attachementsEntity/dto/createAttachementsEntity.dto';
import { UploadAssignmentDto } from './dto/uploadAssignment.dto';
import { AttachmentsEntity } from '../attachementsEntity/entities/attachementsEntity.entity';
import generalJsonResponse from 'src/helper/generalResponse.helper';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';

import fs from 'fs';
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
import { LIMIT_ASSIGNMENT_PAGINATION, RolesEnum } from 'src/types/constants';
import { Class } from '../classes/entities/class.entity';
import { Request } from 'express';
import { ValidateAssignmentOwnerGuard } from './assignments.guard';
import path from 'path';
import AdmZip from 'adm-zip';
import mime from 'mime-type/with-db';
import { PaginationQuery } from './dto/paginationQuery.dto';
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
  ): Promise<Response> {
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
  async findAll(@Res() res: Response): Promise<Response> {
    try {
      const assignments = await this.assignmentsService.findAll();

      if (assignments)
        return generalJsonResponse(res, { success: 1, result: assignments });

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
      return generalJsonResponse(
        res,
        { success: 0 },
        'something went wrong',
        'error',
        false,
        500,
      );
    }
  }

  @UseGuards(ValidateAssignmentOwnerGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
    @Res() res,
  ): Promise<Response> {
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

  @UseGuards(ValidateAssignmentOwnerGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res): Promise<Response> {
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
  ): Promise<Response> {
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
        await this.assignmentsService.addNewAttachementMetadata(
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

  @UseGuards(ValidateAssignmentOwnerGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
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
  @Post('/attachment/:id')
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
  async addAttachemtent(
    @Param('id') id: string,
    @UploadedFiles() files,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response> {
    try {
      const userId: number = req.user.id || 1; //TODO:
      const attachementId: number = +id;
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
        await this.assignmentsService.addAttachementForOldAssignement(
          attachementsFileDetailArray,
          attachementId,
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
  async getAttachementFileMetaData(
    @Param('id') id: string,
    @Res() res,
  ): Promise<Response> {
    try {
      const attachementMetaData: Assignment =
        await this.assignmentsService.getAttachementMetadataByAssignmentId(+id);

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

  @Get('/attachment/:id')
  async getAttachementFile(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const attachementMetaData: AttachmentsEntity =
        await this.assignmentsService.getAttachementMetadataById(+id);

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
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const attachementMetaData: Assignment =
        await this.assignmentsService.getAttachementMetadataByAssignmentId(+id);

      let attachementPaths: string[] = [];

      if (attachementMetaData) {
        attachementMetaData.attachments.forEach((attachement) => {
          const filePath: string = path.resolve(path.join(attachement.path));

          attachementPaths = [...attachementPaths, filePath];
        });
      }

      let zip: AdmZip = new AdmZip();
      attachementPaths.forEach(async (path: string) => {
        if (fs.existsSync(path)) {
          zip.addLocalFile(path);
        }
      });

      let zipContent: Buffer = await zip.toBufferPromise();

      const fileName: string = `assignment_${id}.zip`;
      const fileType: string = 'application/zip';
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

  @Get('/pagination')
  async findWithPagination(
    @Query() paginationQuery: PaginationQuery,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const countOfRecords: number =
        await this.assignmentsService.countOfRecords();
      const offSet: number =
        (paginationQuery.currentPage - 1) * LIMIT_ASSIGNMENT_PAGINATION;

      if (offSet > countOfRecords) {
        return generalJsonResponse(
          res,
          { success: 0, paginationError: 1 },
          '',
          'error',
          false,
          400,
        );
      }

      const assignments: Assignment[] = await this.assignmentsService.findAll(
        offSet,
        LIMIT_ASSIGNMENT_PAGINATION,
      );

      if (assignments)
        return generalJsonResponse(res, {
          success: 1,
          result: assignments,
          totalPages: Math.ceil(countOfRecords / LIMIT_ASSIGNMENT_PAGINATION),
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
      return generalJsonResponse(
        res,
        { success: 0 },
        'something went wrong',
        'error',
        false,
        500,
      );
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const assignment: Assignment = await this.assignmentsService.findOne(+id);

      if (assignment)
        return generalJsonResponse(res, { success: 1, result: assignment });
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
      return generalJsonResponse(
        res,
        { success: 0 },
        'something went wrong',
        'error',
        false,
        500,
      );
    }
  }
}
