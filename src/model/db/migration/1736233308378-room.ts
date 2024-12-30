import { MigrationInterface, QueryRunner } from "typeorm";

export class Room1736233308378 implements MigrationInterface {
    name = 'Room1736233308378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "room" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "UQ_535c742a3606d2e3122f441b26c" UNIQUE ("name"), CONSTRAINT "UQ_62385cfdeaa8900faa5c7be8601" UNIQUE ("email"), CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "microsoft_room" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "UQ_8d04b98415014c8c560b508b10f" UNIQUE ("name"), CONSTRAINT "UQ_75e11134444cee44ac63594a612" UNIQUE ("email"), CONSTRAINT "PK_6fc29bd6deecb6757fc10dfda90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "google_room" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "UQ_cf03abf21a4c0cf9f4b1d7fe84d" UNIQUE ("name"), CONSTRAINT "UQ_489528277eb9044cf3f567480de" UNIQUE ("email"), CONSTRAINT "PK_280b8b1950b674e5c926d0c9a1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "attendees"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "creator"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "organizer"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "organizer" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD "creator" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD "attendees" text array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD "location" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "google_room"`);
        await queryRunner.query(`DROP TABLE "microsoft_room"`);
        await queryRunner.query(`DROP TABLE "room"`);
    }

}
