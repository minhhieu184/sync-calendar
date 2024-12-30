import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
  location: string

  @Column()
  description: string

  @Column({ type: 'timestamptz' })
  start: Date

  @Column({ type: 'timestamptz' })
  end: Date

  @Column({ type: 'text', array: true })
  attendees: string[]

  @Column()
  creator: string

  @Column()
  organizer: string

  @DeleteDateColumn()
  deletedAt?: Date | null;
}
