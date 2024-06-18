import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterSubmissions1718711873009 implements MigrationInterface {
    name = 'AlterSubmissions1718711873009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`submissions\` DROP COLUMN \`dateTime\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`submissions\` ADD \`dateTime\` timestamp NOT NULL`);
    }

}
