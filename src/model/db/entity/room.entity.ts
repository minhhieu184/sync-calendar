import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column({ unique: true })
  email: string
}
