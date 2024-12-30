import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class MicrosoftEventSubscription {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column({ name: 'subscription_id', nullable: true })
  subscriptionId?: string

  // @Column({ name: 'resource_id' })
  // resourceId: string

  // @Column({ name: 'sync_token' })
  // syncToken: string

  @Column({ name: 'expired_at', type: 'timestamptz' })
  expiredAt: Date
}
