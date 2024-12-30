import { MigrationInterface, QueryRunner } from 'typeorm'

export class RoomEvent1736242430165 implements MigrationInterface {
  name = 'RoomEvent1736242430165'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "room_event" ("id" SERIAL NOT NULL, "workspace" character varying NOT NULL, "workspace_event_id" character varying NOT NULL, "eventId" integer, CONSTRAINT "PK_f744dbf4c2ac05e8da3780507e1" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "room_event" ADD CONSTRAINT "FK_1d4314d4bfaf0fb522360baee7d" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_event" DROP CONSTRAINT "FK_1d4314d4bfaf0fb522360baee7d"`
    )
    await queryRunner.query(`DROP TABLE "room_event"`)
  }
}
