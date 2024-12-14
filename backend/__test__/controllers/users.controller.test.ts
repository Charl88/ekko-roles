import request from 'supertest'
import { server } from '../../src/index'
import { AppDataSource } from '../../src/dataSource'

describe('Users Controller', () => {
    beforeAll(async () => {
        await AppDataSource.initialize()
    })

    afterAll(async () => {
        await AppDataSource.destroy()
    })

    describe('GET /users', () => {
        it('should return a list of users', async () => {
            const response = await request(server)
                .get('/users')
                .set('user-id', '1')
            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Array)
        })
    })

    describe('POST /users', () => {
        it('should create a new user', async () => {
            const newUser = {
                name: 'John Doe',
                roleId: 2,
                structureIds: [2, 3],
            }
            const response = await request(server)
                .post('/users')
                .set('user-id', '1')
                .send(newUser)
            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty('id')
            expect(response.body.name).toBe(newUser.name)
        })
    })

    describe('PUT /users/:id', () => {
        it('should update an existing user', async () => {
            const updatedUser = {
                name: 'Jane Doe',
                roleId: 2,
                structureIds: [3, 4],
            }
            const response = await request(server)
                .put('/users/3')
                .set('user-id', '1')
                .send(updatedUser)
            expect(response.status).toBe(200)
            expect(response.body.name).toBe(updatedUser.name)
        })
    })

    describe('DELETE /users/:id', () => {
        it('should delete an existing user', async () => {
            const response = await request(server)
                .delete('/users/5')
                .set('user-id', '1')
            expect(response.status).toBe(200)
            expect(response.body.message).toBe('User deleted successfully')
        })
    })
})
