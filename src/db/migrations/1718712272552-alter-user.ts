import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUser1718712272552 implements MigrationInterface {
    name = 'AlterUser1718712272552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_df34f7fab58003265022e523e7\` ON \`users\` (\`username\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_deafec51d4f61d44fc895e9f64\` ON \`users\` (\`email\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_deafec51d4f61d44fc895e9f64\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_df34f7fab58003265022e523e7\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\``);
    }

}
