import { Entity } from 'typeorm'
import {
  AbstractPolymorphicRepository,
  PolymorphicParent,
  PolymorphicRepository
} from 'typeorm-polymorphic'
import { Room } from './room.entity'
import { WorkspaceRoom } from './workspace-room.entity'

@Entity()
export class GoogleRoom extends WorkspaceRoom {
  @PolymorphicParent(() => Room, { hasMany: false })
  room: Room
}

@PolymorphicRepository(GoogleRoom)
export class GoogleRoomRepository extends AbstractPolymorphicRepository<GoogleRoom> {}
