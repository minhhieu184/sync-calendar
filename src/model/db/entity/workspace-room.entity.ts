import { Column, PrimaryGeneratedColumn } from 'typeorm'
import { PolymorphicChildInterface } from 'typeorm-polymorphic/dist/polymorphic.interface'

export class WorkspaceRoom implements PolymorphicChildInterface {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  entityId: number

  @Column()
  entityType: string

  @Column({ unique: true })
  name: string

  @Column({ unique: true })
  email: string
}
