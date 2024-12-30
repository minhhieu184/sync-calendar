import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { RoomEvent } from './room-event.entity'

export enum Workspace {
  GOOGLE = 'google',
  MICROSOFT = 'microsoft'
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ enum: Workspace })
  workspace: Workspace

  @Column({ name: 'workspace_event_id' })
  workspaceEventId: string

  @Column()
  summary: string

  @Column()
  description: string

  @Column()
  organizer: string

  @Column({ type: 'timestamptz' })
  start: Date

  @Column({ type: 'timestamptz' })
  end: Date

  // @Column({ type: 'text', array: true })
  // attendees: string[]

  // @Column()
  // creator: string

  // @Column()
  // organizer: string

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null

  @OneToMany(() => RoomEvent, (roomEvents) => roomEvents.event, {
    cascade: true
  })
  roomEvents: RoomEvent[]
}
