import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import {
  AbstractPolymorphicRepository,
  PolymorphicChildren,
  PolymorphicRepository
} from 'typeorm-polymorphic'
import { GoogleRoom } from './google-room.entity'
import { MicrosoftRoom } from './microsoft-room.entity'

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  name: string

  @PolymorphicChildren(() => [GoogleRoom, MicrosoftRoom])
  rooms: (GoogleRoom | MicrosoftRoom)[]
}

@PolymorphicRepository(Room)
export class RoomRepository extends AbstractPolymorphicRepository<Room> {}
