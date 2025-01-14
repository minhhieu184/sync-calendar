import { DataSource } from 'typeorm'

const dir = process.env.NODE_ENV === 'development' ? 'src' : 'dist'

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +(process.env.DB_FORWARD_PORT || 5432),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  entities: [`${dir}/**/entity/*.entity.{ts,js}`],
  migrations: [`${dir}/**/migration/**/*{.ts,.js}`]
})
