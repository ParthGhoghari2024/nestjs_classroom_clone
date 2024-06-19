import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterAttachents1718800434491 implements MigrationInterface {
  name = 'AlterAttachents1718800434491';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`submissions\` DROP FOREIGN KEY \`FK_d9d847a9e15edc1a2983d64aa55\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attachments\` DROP FOREIGN KEY \`FK_attachments_assignmentId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attachments\` DROP FOREIGN KEY \`FK_attachments_submissionId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`submissions\` DROP COLUMN \`attachmentsId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attachments\` ADD CONSTRAINT \`FK_attachments_assignmentId\` FOREIGN KEY (\`attachmentId\`) REFERENCES \`assignments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attachments\` ADD CONSTRAINT \`FK_attachments_submissionId\` FOREIGN KEY (\`attachmentId\`) REFERENCES \`submissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`attachments\` DROP FOREIGN KEY \`FK_attachments_submissionId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attachments\` DROP FOREIGN KEY \`FK_attachments_assignmentId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`submissions\` ADD \`attachmentsId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attachments\` ADD CONSTRAINT \`FK_attachments_submissionId\` FOREIGN KEY (\`attachmentId\`) REFERENCES \`submissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attachments\` ADD CONSTRAINT \`FK_attachments_assignmentId\` FOREIGN KEY (\`attachmentId\`) REFERENCES \`assignments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`submissions\` ADD CONSTRAINT \`FK_attachments_submissionId\` FOREIGN KEY (\`attachmentsId\`) REFERENCES \`attachments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
