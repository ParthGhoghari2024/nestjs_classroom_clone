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
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import generalJsonResponse from 'src/helper/generalResponse.helper';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  private readonly logger = new Logger(SubmissionsService.name);

  @Post()
  async create(@Body() createSubmissionDto: CreateSubmissionDto, @Res() res) {
    try {
      const studentId: number = 1; //TODO:
      const createResult = await this.submissionsService.create(
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
  findAll() {
    return this.submissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.submissionsService.update(+id, updateSubmissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionsService.remove(+id);
  }
}
