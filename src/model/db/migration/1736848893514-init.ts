import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1736848893514 implements MigrationInterface {
  name = 'Init1736848893514'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "event" ("id" SERIAL NOT NULL, "workspace" character varying NOT NULL, "workspace_event_id" character varying NOT NULL, "summary" character varying NOT NULL, "description" character varying NOT NULL, "organizer" character varying NOT NULL, "start" TIMESTAMP WITH TIME ZONE NOT NULL, "end" TIMESTAMP WITH TIME ZONE NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "room_event" ("id" SERIAL NOT NULL, "workspace" character varying NOT NULL, "workspace_event_id" character varying NOT NULL, "room_emails" text array NOT NULL, "event_id" integer, CONSTRAINT "PK_f744dbf4c2ac05e8da3780507e1" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "microsoft_room" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "UQ_8d04b98415014c8c560b508b10f" UNIQUE ("name"), CONSTRAINT "UQ_75e11134444cee44ac63594a612" UNIQUE ("email"), CONSTRAINT "PK_6fc29bd6deecb6757fc10dfda90" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "google_room" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "UQ_cf03abf21a4c0cf9f4b1d7fe84d" UNIQUE ("name"), CONSTRAINT "UQ_489528277eb9044cf3f567480de" UNIQUE ("email"), CONSTRAINT "PK_280b8b1950b674e5c926d0c9a1b" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "google_event_channel" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "channel_id" character varying, "resource_id" character varying NOT NULL, "sync_token" character varying NOT NULL, "expired_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "UQ_894fd009fcc66242eb0e9c4abe1" UNIQUE ("email"), CONSTRAINT "PK_3174ce3e83163425d35ccfd05ea" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "room_event" ADD CONSTRAINT "FK_82d224b1684ae42cffc028885cf" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_event" DROP CONSTRAINT "FK_82d224b1684ae42cffc028885cf"`
    )
    await queryRunner.query(`DROP TABLE "google_event_channel"`)
    await queryRunner.query(`DROP TABLE "google_room"`)
    await queryRunner.query(`DROP TABLE "microsoft_room"`)
    await queryRunner.query(`DROP TABLE "room_event"`)
    await queryRunner.query(`DROP TABLE "event"`)
  }
}
