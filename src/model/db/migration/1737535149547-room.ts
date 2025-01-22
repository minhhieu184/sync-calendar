import { MigrationInterface, QueryRunner } from 'typeorm'

export class Room1737535149547 implements MigrationInterface {
  name = 'Room1737535149547'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "room" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_535c742a3606d2e3122f441b26c" UNIQUE ("name"), CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "google_room" ADD "entityId" character varying NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "google_room" ADD "entityType" character varying NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "microsoft_room" ADD "entityId" character varying NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "microsoft_room" ADD "entityType" character varying NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "microsoft_room" DROP COLUMN "entityType"`
    )
    await queryRunner.query(
      `ALTER TABLE "microsoft_room" DROP COLUMN "entityId"`
    )
    await queryRunner.query(
      `ALTER TABLE "google_room" DROP COLUMN "entityType"`
    )
    await queryRunner.query(`ALTER TABLE "google_room" DROP COLUMN "entityId"`)
    await queryRunner.query(`DROP TABLE "room"`)
  }
}
