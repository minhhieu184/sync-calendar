import { MigrationInterface, QueryRunner } from 'typeorm'

export class RoomEvent1736361262708 implements MigrationInterface {
  name = 'RoomEvent1736361262708'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_event" RENAME COLUMN "roomEmail" TO "roomEmails"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_event" RENAME COLUMN "roomEmails" TO "roomEmail"`
    )
  }
}
