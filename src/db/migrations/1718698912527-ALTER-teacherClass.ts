import { MigrationInterface, QueryRunner } from 'typeorm';

export class ALTERTeacherClass1718698912527 implements MigrationInterface {
  name = 'ALTERTeacherClass1718698912527';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`teacher_classes\` DROP FOREIGN KEY \`FK_teacherClasses_classId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`teacher_classes\` DROP FOREIGN KEY \`FK_teacherClasses_userId\``,
    );
    await queryRunner.query(
      `DROP INDEX \`unique-teacher-class\` ON \`teacher_classes\``,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`unique-teacher-class\` ON \`teacher_classes\` (\`userId\`, \`classId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`teacher_classes\` ADD CONSTRAINT \`FK_teacherClasses_userId\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`teacher_classes\` ADD CONSTRAINT \`FK_teacherClasses_classId\` FOREIGN KEY (\`classId\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`unique-teacher-class\` ON \`teacher_classes\``,
    );
    await queryRunner.query(
      `CREATE INDEX \`unique-teacher-class\` ON \`teacher_classes\` (\`userId\`, \`classId\`)`,
    );
  }
}
