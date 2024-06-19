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
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/createSubmission.dto';
import { UpdateSubmissionDto } from './dto/updateSubmission.dto';
import generalJsonResponse from 'src/helper/generalResponse.helper';
import { Submission } from './entities/submission.entity';
import { UpdateResult } from 'typeorm';

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
  async findOne(@Param('id') id: string) {
    return await this.submissionsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return await this.submissionsService.update(+id, updateSubmissionDto);
  }

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
}
