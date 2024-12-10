import { config } from 'dotenv'

config({ path: '.env' })

console.log('process.env.POSTGRES_HOST:', process.env.POSTGRES_HOST)
// export default new DataSource({
//   type: 'postgres',
//   host: process.env.POSTGRES_HOST,
//   port: +process.env.DB_FORWARD_PORT!,
//   username: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   database: process.env.POSTGRES_DB,
//   // entities: [join(__dirname, '**', '*.entity.{ts,js}')],
//   entities: ['src/model/db/entity/*.entity.ts'],
//   // entities: [User],
//   synchronize: false,
//   migrations: ['src/model/db/migration/**/*{.ts,.js}']
// })

