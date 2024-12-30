import { MigrationInterface, QueryRunner } from 'typeorm'

export class RoomEvent1736394563240 implements MigrationInterface {
  name = 'RoomEvent1736394563240'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event" RENAME COLUMN "deletedAt" TO "deleted_at"`
    )
    await queryRunner.query(
      `ALTER TABLE "room_event" RENAME COLUMN "eventId" TO "event_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "room_event" RENAME COLUMN "roomEmails" TO "room_emails"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event" RENAME COLUMN "deleted_at" TO "deletedAt"`
    )
    await queryRunner.query(
      `ALTER TABLE "room_event" RENAME COLUMN "event_id" TO "eventId"`
    )
    await queryRunner.query(
      `ALTER TABLE "room_event" RENAME COLUMN "room_emails" TO "roomEmails"`
    )
  }
}
