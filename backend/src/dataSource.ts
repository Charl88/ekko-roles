import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './entities/user'
import { Role } from './entities/role'
import { Structure } from './entities/structure'
import 'dotenv/config'

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: DB_HOST || 'localhost',
    port: parseInt(DB_PORT || '5432'),
    username: DB_USER || 'postgres',
    password: DB_PASSWORD || '',
    database:
        process.env.NODE_ENV === 'test' ? 'test_db' : DB_NAME || 'ekko_roles',
    synchronize: false, // set to false in production, and use migrations instead
    logging: true,
    entities: [User, Role, Structure],
    migrations: ['./src/migrations/*.ts'],
    migrationsTableName:
        process.env.NODE_ENV === 'test' ? 'migrations_test' : 'migrations',
})
