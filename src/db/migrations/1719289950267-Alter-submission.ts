import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterSubmission1719289950267 implements MigrationInterface {
  name = 'AlterSubmission1719289950267';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   `ALTER TABLE \`submissions\` DROP FOREIGN KEY \`FK_babd11a8c2b3f3472cad74f0f60\``,
    // );
    // await queryRunner.query(
    //   `DROP INDEX \`FK_35138b11d46d53c48ed932afa47_idx\` ON \`attachments\``,
    // );
    await queryRunner.query(
      `ALTER TABLE \`submissions\` CHANGE \`assignementId\` \`assignmentId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`submissions\` ADD CONSTRAINT \`FK_c2611c601f49945ceff5c0909a2\` FOREIGN KEY (\`assignmentId\`) REFERENCES \`assignments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`submissions\` DROP FOREIGN KEY \`FK_c2611c601f49945ceff5c0909a2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`submissions\` CHANGE \`assignmentId\` \`assignementId\` int NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`FK_35138b11d46d53c48ed932afa47_idx\` ON \`attachments\` (\`userId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`submissions\` ADD CONSTRAINT \`FK_babd11a8c2b3f3472cad74f0f60\` FOREIGN KEY (\`assignementId\`) REFERENCES \`assignments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
