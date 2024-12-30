import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class GoogleEventChannel {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column({ name: 'channel_id', nullable: true })
  channelId?: string

  @Column({ name: 'resource_id' })
  resourceId: string

  @Column({ name: 'sync_token' })
  syncToken: string

  @Column({ name: 'expired_at', type: 'timestamptz' })
  expiredAt: Date
}
