import { MigrationInterface, QueryRunner } from 'typeorm'

export class RoomEvent1736319213112 implements MigrationInterface {
  name = 'RoomEvent1736319213112'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_event" DROP CONSTRAINT "FK_1d4314d4bfaf0fb522360baee7d"`
    )
    await queryRunner.query(
      `ALTER TABLE "room_event" ADD "roomEmail" text array NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "room_event" ADD CONSTRAINT "FK_1d4314d4bfaf0fb522360baee7d" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_event" DROP CONSTRAINT "FK_1d4314d4bfaf0fb522360baee7d"`
    )
    await queryRunner.query(`ALTER TABLE "room_event" DROP COLUMN "roomEmail"`)
    await queryRunner.query(
      `ALTER TABLE "room_event" ADD CONSTRAINT "FK_1d4314d4bfaf0fb522360baee7d" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
