import { DataSource } from 'typeorm'

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +(process.env.DB_FORWARD_PORT || 5432),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/model/db/entity/*.entity.ts'],
  synchronize: false,
  migrations: ['src/model/db/migration/**/*{.ts,.js}']
})
