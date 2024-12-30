import { MigrationInterface, QueryRunner } from "typeorm";

export class Event1735901542710 implements MigrationInterface {
    name = 'Event1735901542710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "deletedAt"`);
    }

}
