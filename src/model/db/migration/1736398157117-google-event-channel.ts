import { MigrationInterface, QueryRunner } from 'typeorm'

export class GoogleEventChannel1736398157117 implements MigrationInterface {
  name = 'GoogleEventChannel1736398157117'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE event_channel RENAME TO google_event_channel`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE google_event_channel RENAME TO event_channel`
    )
  }
}
