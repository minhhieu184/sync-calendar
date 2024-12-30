import { MigrationInterface, QueryRunner } from 'typeorm'

export class EventChannel1735642361161 implements MigrationInterface {
  name = 'EventChannel1735642361161'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "event_channel" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "channelId" character varying, "resourceId" character varying NOT NULL, "syncToken" character varying NOT NULL, "expiredAt" TIMESTAMP, CONSTRAINT "PK_08b5b734372bd834bb1dd3c7568" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "gmail" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "outlook" DROP NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "outlook" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "gmail" SET NOT NULL`
    )
    await queryRunner.query(`DROP TABLE "event_channel"`)
  }
}
