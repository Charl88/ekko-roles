import request from 'supertest'
import { AppDataSource } from '../../src/dataSource'
import { Role } from '../../src/entities/role'
import { server } from '../../src'

beforeAll(async () => {
    await AppDataSource.initialize()
    await AppDataSource.runMigrations()
})

afterAll(async () => {
    await AppDataSource.dropDatabase()
    await AppDataSource.destroy()
    server.close()
})

describe('Roles API', () => {
    it('should create a new role', async () => {
        const response = await request(server)
            .post('/roles')
            .send({ name: 'Admin' })
        expect(response.status).toBe(201)
        expect(response.body.name).toBe('Admin')
    })

    it('should get all roles', async () => {
        const response = await request(server).get('/roles')
        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
    })

    it('should get a role by id', async () => {
        const role = await AppDataSource.getRepository(Role).save({
            name: 'User',
        })
        const response = await request(server).get(`/roles/${role.id}`)
        expect(response.status).toBe(200)
        expect(response.body.name).toBe('User')
    })

    it('should update a role', async () => {
        const role = await AppDataSource.getRepository(Role).save({
            name: 'Guest',
        })
        const response = await request(server)
            .put(`/roles/${role.id}`)
            .send({ name: 'Updated Guest' })
        expect(response.status).toBe(200)
        expect(response.body.name).toBe('Updated Guest')
    })

    it('should error when updating a non-existent role', async () => {
        const response = await request(server)
            .put('/roles/999')
            .send({ name: 'Updated Guest' })
        expect(response.status).toBe(404)
        expect(response.body.message).toBe('Role not found')
    })

    it('should delete a role', async () => {
        const role = await AppDataSource.getRepository(Role).save({
            name: 'Temp',
        })
        const response = await request(server).delete(`/roles/${role.id}`)
        expect(response.status).toBe(200)
    })
})
