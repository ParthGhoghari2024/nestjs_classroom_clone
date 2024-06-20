import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewAlterAttachs1718876418180 implements MigrationInterface {
  name = 'NewAlterAttachs1718876418180';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   `ALTER TABLE \`attachments\` ADD CONSTRAINT \`FK_b1ffe3b6c50c6b90d0b688448a5\` FOREIGN KEY (\`attachmentId\`) REFERENCES \`assignments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`attachments\` ADD CONSTRAINT \`FK_b1ffe3b6c50c6b90d0b688448a5\` FOREIGN KEY (\`attachmentId\`) REFERENCES \`submissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   `ALTER TABLE \`attachments\` DROP FOREIGN KEY \`FK_b1ffe3b6c50c6b90d0b688448a5\``,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE \`attachments\` DROP FOREIGN KEY \`FK_b1ffe3b6c50c6b90d0b688448a5\``,
    // );
  }
}
