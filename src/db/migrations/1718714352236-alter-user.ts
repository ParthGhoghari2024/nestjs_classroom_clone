import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUser1718714352236 implements MigrationInterface {
  name = 'AlterUser1718714352236';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`password\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`password\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\` (\`username\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\` (\`email\`)`,
    );
  }
}
