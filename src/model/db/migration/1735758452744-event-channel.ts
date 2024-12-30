import { MigrationInterface, QueryRunner } from "typeorm";

export class EventChannel1735758452744 implements MigrationInterface {
    name = 'EventChannel1735758452744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_channel" ADD CONSTRAINT "UQ_30b39302390eb27880677a9eeeb" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_channel" DROP CONSTRAINT "UQ_30b39302390eb27880677a9eeeb"`);
    }

}
