import { Assignment } from 'src/modules/assignments/entities/assignment.entity';
import { Submission } from 'src/modules/submissions/entities/submission.entity';

export class CreateAttachementsEntityDto {
  attachmentId: number;

  attachmentType: 'assignment' | 'submission';

  original_filename: string;

  new_filename: string;

  path: string;
}
