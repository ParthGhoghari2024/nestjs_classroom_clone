import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubmissions1718710648376 implements MigrationInterface {
  name = 'CreateSubmissions1718710648376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`submissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`studentId\` int NOT NULL, \`classId\` int NOT NULL, \`submission\` text NOT NULL, \`dateTime\` timestamp NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`submissions\` ADD CONSTRAINT \`FK_4fc99318a291abd7e2a50f50851\` FOREIGN KEY (\`studentId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`submissions\` ADD CONSTRAINT \`FK_4c97916a5229fc6ed976cf45111\` FOREIGN KEY (\`classId\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`submissions\` DROP FOREIGN KEY \`FK_4c97916a5229fc6ed976cf45111\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`submissions\` DROP FOREIGN KEY \`FK_4fc99318a291abd7e2a50f50851\``,
    );
    await queryRunner.query(`DROP TABLE \`submissions\``);
  }
}
