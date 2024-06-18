import { MigrationInterface, QueryRunner } from "typeorm";

export class Intial1718708816603 implements MigrationInterface {
    name = 'Intial1718708816603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`role\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`student_classes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`classId\` int NOT NULL, \`userId\` int NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, UNIQUE INDEX \`IDX_8a9de2144549af80601b95cfbc\` (\`userId\`, \`classId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`roleId\` int NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`assignments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`classId\` int NOT NULL, \`teacherId\` int NOT NULL, \`title\` varchar(255) NOT NULL, \`descrption\` varchar(255) NOT NULL, \`dueDate\` datetime NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`classes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`UId\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teacher_classes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`classId\` int NOT NULL, \`userId\` int NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, UNIQUE INDEX \`IDX_ca9d65be267d93f1fb83f29170\` (\`userId\`, \`classId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`student_classes\` ADD CONSTRAINT \`FK_57793635aa299f1f681677b6adf\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`student_classes\` ADD CONSTRAINT \`FK_3f18cbd0ea5362b0c8727070739\` FOREIGN KEY (\`classId\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_368e146b785b574f42ae9e53d5e\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assignments\` ADD CONSTRAINT \`FK_c5382064b68e93e2ac371de898e\` FOREIGN KEY (\`classId\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`assignments\` ADD CONSTRAINT \`FK_e9a3111140d313859c9dfa8f22d\` FOREIGN KEY (\`teacherId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`teacher_classes\` ADD CONSTRAINT \`FK_57c5209040e29017a723269d18e\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`teacher_classes\` ADD CONSTRAINT \`FK_d297dd8fa5ebc846ea6e2b606de\` FOREIGN KEY (\`classId\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teacher_classes\` DROP FOREIGN KEY \`FK_d297dd8fa5ebc846ea6e2b606de\``);
        await queryRunner.query(`ALTER TABLE \`teacher_classes\` DROP FOREIGN KEY \`FK_57c5209040e29017a723269d18e\``);
        await queryRunner.query(`ALTER TABLE \`assignments\` DROP FOREIGN KEY \`FK_e9a3111140d313859c9dfa8f22d\``);
        await queryRunner.query(`ALTER TABLE \`assignments\` DROP FOREIGN KEY \`FK_c5382064b68e93e2ac371de898e\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_368e146b785b574f42ae9e53d5e\``);
        await queryRunner.query(`ALTER TABLE \`student_classes\` DROP FOREIGN KEY \`FK_3f18cbd0ea5362b0c8727070739\``);
        await queryRunner.query(`ALTER TABLE \`student_classes\` DROP FOREIGN KEY \`FK_57793635aa299f1f681677b6adf\``);
        await queryRunner.query(`DROP INDEX \`IDX_ca9d65be267d93f1fb83f29170\` ON \`teacher_classes\``);
        await queryRunner.query(`DROP TABLE \`teacher_classes\``);
        await queryRunner.query(`DROP TABLE \`classes\``);
        await queryRunner.query(`DROP TABLE \`assignments\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_8a9de2144549af80601b95cfbc\` ON \`student_classes\``);
        await queryRunner.query(`DROP TABLE \`student_classes\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
