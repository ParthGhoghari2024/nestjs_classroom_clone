import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterClass1718948946086 implements MigrationInterface {
  name = 'AlterClass1718948946086';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`assignments\` CHANGE \`descrption\` \`description\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`assignments\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`assignments\` ADD \`description\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`assignments\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`assignments\` ADD \`description\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`assignments\` CHANGE \`description\` \`descrption\` varchar(255) NOT NULL`,
    );
  }
}
