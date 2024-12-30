import { MigrationInterface, QueryRunner } from "typeorm";

export class Event1735895942795 implements MigrationInterface {
    name = 'Event1735895942795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "calendar_id"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "workspace" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD "origin_event_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "origin_event_id"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "workspace"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "calendar_id" character varying NOT NULL`);
    }

}
