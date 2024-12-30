import { MigrationInterface, QueryRunner } from 'typeorm'

export class EventChannel1735785432000 implements MigrationInterface {
  name = 'EventChannel1735785432000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_channel" ALTER COLUMN "expiredAt" SET NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_channel" ALTER COLUMN "expiredAt" DROP NOT NULL`
    )
  }
}
