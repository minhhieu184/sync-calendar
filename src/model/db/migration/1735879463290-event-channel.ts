import { MigrationInterface, QueryRunner } from 'typeorm'

export class EventChannel1735879463290 implements MigrationInterface {
  name = 'EventChannel1735879463290'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_channel" RENAME COLUMN "channelId" TO "channel_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "event_channel" RENAME COLUMN "resourceId" TO "resource_id"`
    )
    await queryRunner.query(
      `ALTER TABLE "event_channel" RENAME COLUMN "syncToken" TO "sync_token"`
    )
    await queryRunner.query(
      `ALTER TABLE "event_channel" RENAME COLUMN "expiredAt" TO "expired_at"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_channel" RENAME COLUMN "channel_id" TO "channelId"`
    )
    await queryRunner.query(
      `ALTER TABLE "event_channel" RENAME COLUMN "resource_id" TO "resourceId"`
    )
    await queryRunner.query(
      `ALTER TABLE "event_channel" RENAME COLUMN "sync_token" TO "syncToken"`
    )
    await queryRunner.query(
      `ALTER TABLE "event_channel" RENAME COLUMN "expired_at" TO "expiredAt"`
    )
  }
}
