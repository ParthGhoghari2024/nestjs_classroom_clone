import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterClasses1718971494533 implements MigrationInterface {
  name = 'AlterClasses1718971494533';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`classes\` ADD \`userId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_5143080a1d85ca2dc583a1e54f0\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`classes\` DROP FOREIGN KEY \`FK_5143080a1d85ca2dc583a1e54f0\``,
    );
    await queryRunner.query(`ALTER TABLE \`classes\` DROP COLUMN \`userId\``);
  }
}
