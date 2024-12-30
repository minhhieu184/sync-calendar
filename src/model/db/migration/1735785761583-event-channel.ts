import { MigrationInterface, QueryRunner } from "typeorm";

export class EventChannel1735785761583 implements MigrationInterface {
    name = 'EventChannel1735785761583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_channel" DROP COLUMN "expiredAt"`);
        await queryRunner.query(`ALTER TABLE "event_channel" ADD "expiredAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_channel" DROP COLUMN "expiredAt"`);
        await queryRunner.query(`ALTER TABLE "event_channel" ADD "expiredAt" TIMESTAMP`);
    }

}
