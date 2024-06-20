import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAttachents1718857657057 implements MigrationInterface {
    name = 'AlterAttachents1718857657057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`attachments\` DROP FOREIGN KEY \`FK_attachments_assignmentId\``);
        await queryRunner.query(`ALTER TABLE \`attachments\` DROP FOREIGN KEY \`FK_attachments_submissionId\``);
        await queryRunner.query(`ALTER TABLE \`attachments\` ADD CONSTRAINT \`FK_b1ffe3b6c50c6b90d0b688448a5\` FOREIGN KEY (\`attachmentId\`) REFERENCES \`submissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`attachments\` DROP FOREIGN KEY \`FK_b1ffe3b6c50c6b90d0b688448a5\``);
        await queryRunner.query(`ALTER TABLE \`attachments\` ADD CONSTRAINT \`FK_attachments_submissionId\` FOREIGN KEY (\`attachmentId\`) REFERENCES \`submissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`attachments\` ADD CONSTRAINT \`FK_attachments_assignmentId\` FOREIGN KEY (\`attachmentId\`) REFERENCES \`assignments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
