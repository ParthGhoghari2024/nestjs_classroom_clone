import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterSubmission1719289393723 implements MigrationInterface {
  name = 'AlterSubmission1719289393723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`submissions\` DROP FOREIGN KEY \`FK_4c97916a5229fc6ed976cf45111\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`submissions\` CHANGE \`classId\` \`assignementId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`submissions\` ADD CONSTRAINT \`FK_babd11a8c2b3f3472cad74f0f60\` FOREIGN KEY (\`assignementId\`) REFERENCES \`assignments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`submissions\` DROP FOREIGN KEY \`FK_babd11a8c2b3f3472cad74f0f60\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`submissions\` CHANGE \`assignementId\` \`classId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`submissions\` ADD CONSTRAINT \`FK_4c97916a5229fc6ed976cf45111\` FOREIGN KEY (\`classId\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
