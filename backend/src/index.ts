import express from 'express'
import { Server } from 'http'
import 'dotenv/config'
import { AppDataSource } from './dataSource'
import userRoutes from './routes/users'
import roleRoutes from './routes/roles'
import structureRoutes from './routes/structure'

const PORT = process.env.PORT || 4000

const app = express()

app.use(express.json())
app.use('/users', userRoutes)
app.use('/roles', roleRoutes)
app.use('/structures', structureRoutes)

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected!')
    })
    .catch((error) => console.error('Database connection failed:', error))

export const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
