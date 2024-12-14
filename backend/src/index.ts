import express from 'express'
import { Server } from 'http'
import 'dotenv/config'
import { AppDataSource } from './dataSource'
import userRoutes from './routes/users'

const PORT = process.env.PORT || 4000

const app = express()

app.use(express.json())
app.use('/users', userRoutes)

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected!')
    })
    .catch((error) => console.error('Database connection failed:', error))

export const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
