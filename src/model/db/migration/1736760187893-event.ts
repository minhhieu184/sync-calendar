import { MigrationInterface, QueryRunner } from "typeorm";

export class Event1736760187893 implements MigrationInterface {
    name = 'Event1736760187893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "organizer" DROP DEFAULT`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "google_event_channel_id_seq" OWNED BY "google_event_channel"."id"`);
        await queryRunner.query(`ALTER TABLE "google_event_channel" ALTER COLUMN "id" SET DEFAULT nextval('"google_event_channel_id_seq"')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "google_event_channel" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "google_event_channel_id_seq"`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "organizer" SET DEFAULT 'hieuptm@iceteasoftware.com'`);
    }

}
