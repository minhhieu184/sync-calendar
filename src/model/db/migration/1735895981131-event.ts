import { MigrationInterface, QueryRunner } from "typeorm";

export class Event1735895981131 implements MigrationInterface {
    name = 'Event1735895981131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" RENAME COLUMN "origin_event_id" TO "workspace_event_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" RENAME COLUMN "workspace_event_id" TO "origin_event_id"`);
    }

}
