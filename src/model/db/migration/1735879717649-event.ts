import { MigrationInterface, QueryRunner } from 'typeorm'

export class Event1735879717649 implements MigrationInterface {
  name = 'Event1735879717649'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "event" ("id" SERIAL NOT NULL, "calendar_id" character varying NOT NULL, "summary" character varying NOT NULL, "location" character varying NOT NULL, "description" character varying NOT NULL, "start" TIMESTAMP WITH TIME ZONE NOT NULL, "end" TIMESTAMP WITH TIME ZONE NOT NULL, "attendees" text array NOT NULL, "creator" character varying NOT NULL, "organizer" character varying NOT NULL, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "event"`)
  }
}
