import express from 'express'
import 'dotenv/config'
import { AppDataSource } from './dataSource'
import userRoutes from './routes/users'
import roleRoutes from './routes/roles'
import structureRoutes from './routes/structure'

const PORT = process.env.PORT || 4000
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

const app = express()

app.use(express.json())
app.use('/users', userRoutes)
app.use('/roles', roleRoutes)
app.use('/structures', structureRoutes)

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected!')
        console.log(
            `Database connection URL: postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
        )
    })
    .catch((error) => console.error('Database connection failed:', error))

export const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
