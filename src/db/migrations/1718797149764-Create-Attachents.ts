import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAttachents1718797149764 implements MigrationInterface {
  name = 'CreateAttachents1718797149764';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`attachments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`attachmentId\` int NOT NULL, \`attachmentType\` varchar(255) NOT NULL, \`original_filename\` varchar(255) NOT NULL, \`new_filename\` varchar(255) NOT NULL, \`path\` tinytext NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`submissions\` ADD CONSTRAINT \`FK_d9d847a9e15edc1a2983d64aa55\` FOREIGN KEY (\`attachmentsId\`) REFERENCES \`attachments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`submissions\` DROP FOREIGN KEY \`FK_d9d847a9e15edc1a2983d64aa55\``,
    );
    await queryRunner.query(`DROP TABLE \`attachments\``);
  }
}
