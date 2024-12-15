import { AppDataSource } from '../../src/dataSource'
import { server } from '../../src'
import { Structure } from '../../src/entities/structure'
import request from 'supertest'

beforeAll(async () => {
    await AppDataSource.initialize()
    await AppDataSource.runMigrations()
})

afterAll(async () => {
    await AppDataSource.dropDatabase()
    await AppDataSource.destroy()
    server.close()
})

describe('Structures API', () => {
    it('should create a new structure', async () => {
        const parent = await AppDataSource.getRepository(Structure).findOne({
            where: { id: 1 },
        })
        const response = await request(server)
            .post('/structures')
            .send({ name: 'Department A', parent: parent })
        expect(response.status).toBe(201)
        expect(response.body.name).toBe('Department A')
        expect(response.body.parent).toEqual(parent)
    })

    it('should get all structures', async () => {
        const response = await request(server).get('/structures')
        expect(response.status).toBe(200)
        expect(Array.isArray(response.body)).toBe(true)
    })

    it('should get a structure by id', async () => {
        const structure = await AppDataSource.getRepository(Structure).save({
            name: 'Department B',
        })
        const response = await request(server).get(
            `/structures/${structure.id}`
        )
        expect(response.status).toBe(200)
        expect(response.body.name).toBe('Department B')
    })

    it('should update a structure', async () => {
        const structure = await AppDataSource.getRepository(Structure).save({
            name: 'Department C',
        })
        const response = await request(server)
            .put(`/structures/${structure.id}`)
            .send({ name: 'Updated Department C' })
        expect(response.status).toBe(200)
        expect(response.body.name).toBe('Updated Department C')
    })

    it('should error when updating a non-existent structure', async () => {
        const response = await request(server)
            .put('/structures/999')
            .send({ name: 'Updated Department C' })
        expect(response.status).toBe(404)
        expect(response.body.message).toBe('Structure not found')
    })

    it('should delete a structure', async () => {
        const structure = await AppDataSource.getRepository(Structure).save({
            name: 'Temp Department',
        })
        const response = await request(server).delete(
            `/structures/${structure.id}`
        )
        expect(response.status).toBe(200)
    })
})
