import { Column, PrimaryGeneratedColumn } from 'typeorm'

export class Room {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @Column({ unique: true })
  email: string
}
