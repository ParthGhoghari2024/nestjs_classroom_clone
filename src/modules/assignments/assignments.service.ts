import { Injectable, Logger } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/createAssignment.dto';
import { UpdateAssignmentDto } from './dto/updateAssignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from './entities/assignment.entity';
import { Repository } from 'typeorm';
import { CreateAttachementsEntityDto } from '../attachementsEntity/dto/createAttachementsEntity.dto';
import { AttachementsEntityService } from '../attachementsEntity/attachementsEntity.service';
import { AttachmentsEntity } from '../attachementsEntity/entities/attachementsEntity.entity';
import { UploadAssignmentDto } from './dto/uploadAssignment.dto';
import { UploadSubmissionDto } from '../submissions/dto/uploadSubmission.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,

    private readonly attachementsEntityService: AttachementsEntityService,
  ) {}

  private logger: Logger = new Logger(AssignmentsService.name);
  async create(createAssignmentDto: CreateAssignmentDto, userId: number) {
    const assignment = new Assignment();
    assignment.classId = createAssignmentDto.classId;
    assignment.teacherId = userId;
    assignment.title = createAssignmentDto.title;
    assignment.descrption = createAssignmentDto.description;
    assignment.dueDate = createAssignmentDto.dueDate;
    return await this.assignmentRepository.save(assignment);
  }

  async addAttachementMetadata(
    createAttachementsEntityDtos: CreateAttachementsEntityDto[],
    uploadAssignmentDto: UploadAssignmentDto,
    userId: number,
  ) {
    try {
      return await this.attachementsEntityService.createBulkAssignements(
        createAttachementsEntityDtos,
        uploadAssignmentDto,
        userId,
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
  async getAttachementMetadata(attachementId: number) {
    try {
      // return await this.attachementsEntityService.findByAttachmentId(
      //   attachementId,
      // );
      return await this.assignmentRepository.findOne({
        where: {
          id: attachementId,
          // attachments: true,
          // attachments: true,
        },
        relations: {
          attachments: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
  findAll() {
    return this.assignmentRepository.find({
      select: {
        id: true,
        // classId: true,
        // teacherId: true,
        class: {
          id: true,
          name: true,
        },
        teacher: {
          id: true,
          username: true,
          email: true,
        },
        title: true,
        descrption: true,
        dueDate: true,
      },
      relations: {
        class: true,
        teacher: true,
      },
    });
  }

  async findOne(id: number) {
    return this.assignmentRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        class: {
          id: true,
          name: true,
        },
        teacher: {
          id: true,
          username: true,
          email: true,
        },
        title: true,
        descrption: true,
        dueDate: true,
        attachments: {
          path: true,
        },
      },
      relations: {
        class: true,
        teacher: true,
        attachments: true,
      },
    });
  }

  update(id: number, updateAssignmentDto: UpdateAssignmentDto) {
    return `This action updates a #${id} assignment`;
  }

  remove(id: number) {
    return `This action removes a #${id} assignment`;
  }

  async createBulkWithAttachement(assignments: Assignment) {
    try {
      return await this.assignmentRepository.save(assignments);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
