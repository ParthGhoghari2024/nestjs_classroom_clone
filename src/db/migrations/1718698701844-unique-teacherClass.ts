import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueTeacherClass1718698701844 implements MigrationInterface {
  name = 'UniqueTeacherClass1718698701844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX \`unique-teacher-class\` ON \`teacher_classes\` (\`userId\`, \`classId\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`unique-teacher-class\` ON \`teacher_classes\``,
    );
  }
}
