import 'dotenv/config'
import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'
import { attachPaginate } from 'knex-paginate'

export const config: Knex.Config = {
    client: 'pg',
    connection: {
        host: env.DATABASE_HOST,
        port: env.DATABASE_PORT,
        user: env.DATABASE_USER,
        password: env.DATABASE_PASSWORD,
        database: env.DATABASE_NAME,
        options: `--client_encoding=UTF8`,
        family: 4,
    },
    migrations: {
        extension: 'ts',
        directory : './src/database/migrations'
    }
}
export const knex = setupKnex(config)
attachPaginate();
