export class CreateAssignmentDto {
  classId: number;
  teacherId?: number;
  title: string;
  description: string;
  dueDate: Date;
}
