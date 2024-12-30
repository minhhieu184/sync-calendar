import { MigrationInterface, QueryRunner } from "typeorm";

export class MicrosoftEventSubscription1736398335934 implements MigrationInterface {
    name = 'MicrosoftEventSubscription1736398335934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_event" DROP CONSTRAINT "FK_1d4314d4bfaf0fb522360baee7d"`);
        await queryRunner.query(`CREATE TABLE "microsoft_event_subscription" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "subscription_id" character varying, "expired_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "UQ_8f7aef3ff31b02e3028849d46b0" UNIQUE ("email"), CONSTRAINT "PK_d824eef57e84ff8bba78fb45de9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "google_event_channel_id_seq" OWNED BY "google_event_channel"."id"`);
        await queryRunner.query(`ALTER TABLE "google_event_channel" ALTER COLUMN "id" SET DEFAULT nextval('"google_event_channel_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "google_event_channel" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "room_event" ADD CONSTRAINT "FK_82d224b1684ae42cffc028885cf" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_event" DROP CONSTRAINT "FK_82d224b1684ae42cffc028885cf"`);
        await queryRunner.query(`ALTER TABLE "google_event_channel" ALTER COLUMN "id" SET DEFAULT nextval('event_channel_id_seq')`);
        await queryRunner.query(`ALTER TABLE "google_event_channel" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "google_event_channel_id_seq"`);
        await queryRunner.query(`DROP TABLE "microsoft_event_subscription"`);
        await queryRunner.query(`ALTER TABLE "room_event" ADD CONSTRAINT "FK_1d4314d4bfaf0fb522360baee7d" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
