import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Event, Workspace } from './event.entity'

@Entity()
export class RoomEvent {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Event, (event) => event.roomEvents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event

  @Column({ enum: Workspace })
  workspace: Workspace

  @Column({ name: 'workspace_event_id' })
  workspaceEventId: string

  @Column({ type: 'text', array: true, name: 'room_emails' })
  roomEmails: string[]
}
