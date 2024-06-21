import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterAttachments1718957908413 implements MigrationInterface {
  name = 'AlterAttachments1718957908413';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`attachments\` ADD \`userId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attachments\` ADD CONSTRAINT \`FK_35138b11d46d53c48ed932afa47\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`attachments\` DROP FOREIGN KEY \`FK_35138b11d46d53c48ed932afa47\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`attachments\` DROP COLUMN \`userId\``,
    );
  }
}
