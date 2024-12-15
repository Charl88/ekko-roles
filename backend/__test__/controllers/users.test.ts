import request from 'supertest'
import { server } from '../../src'
import { AppDataSource } from '../../src/dataSource'
import { User } from '../../src/entities/user'
import { Structure } from '../../src/entities/structure'

describe('Users API', () => {
    beforeEach(async () => {
        await AppDataSource.initialize()
        await AppDataSource.runMigrations()
    })

    afterEach(async () => {
        jest.restoreAllMocks()
        await AppDataSource.dropDatabase()
        await AppDataSource.destroy()
    })

    afterAll((done) => {
        server.close(done)
    })

    describe('GET /users', () => {
        it('should return a list of users only in descendants of the users structure', async () => {
            const user = await AppDataSource.getRepository(User).findOne({
                where: { id: 3 },
                relations: ['structures'],
            })
            const allDescendants = new Set()
            for (const structure of user!.structures) {
                const descendants = await AppDataSource.manager
                    .getTreeRepository(Structure)
                    .findDescendants(structure)

                descendants.forEach((descendant) => {
                    if (descendant.id !== structure.id) {
                        allDescendants.add(descendant)
                    }
                })
            }
            const response = await request(server)
                .get('/users')
                .set('user-id', '3')
            expect(response.status).toBe(200)

            // for all the users in the response, check if they are in the descendants of the user's structure
            response.body.forEach((user: User) => {
                expect(
                    user.structures.some((structure: Structure) =>
                        Array.from(allDescendants as Set<Structure>).some(
                            (descendant: Structure) =>
                                descendant.id === structure.id
                        )
                    )
                ).toBe(true)
            })
        })

        it('should handle errors', async () => {
            jest.spyOn(
                AppDataSource.getRepository(User),
                'find'
            ).mockRejectedValue(new Error('Database error'))
            const response = await request(server)
                .get('/users')
                .set('user-id', '1')
            expect(response.status).toBe(500)
            expect(response.body.message).toBe('Internal Server Error')
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

        it('should handle validation errors', async () => {
            const invalidUser = {
                name: '',
                roleId: 2,
                structureIds: [2, 3],
            }
            const response = await request(server)
                .post('/users')
                .set('user-id', '1')
                .send(invalidUser)
            expect(response.status).toBe(400)
            expect(response.body.message).toBe('Validation failed')
        })

        it('should handle server errors', async () => {
            jest.spyOn(
                AppDataSource.getRepository(User),
                'save'
            ).mockRejectedValue(new Error('Database error'))
            const newUser = {
                name: 'John Doe',
                roleId: 2,
                structureIds: [2, 3],
            }
            const response = await request(server)
                .post('/users')
                .set('user-id', '1')
                .send(newUser)
            expect(response.status).toBe(500)
            expect(response.body.message).toBe('Internal Server Error')
        })

        it('should handle missing fields', async () => {
            const newUser = {
                roleId: 2,
                structureIds: [2, 3],
            }
            const response = await request(server)
                .post('/users')
                .set('user-id', '1')
                .send(newUser)
            expect(response.status).toBe(400)
            expect(response.body.message).toBe('Validation failed')
        })

        it('should handle invalid role ID', async () => {
            const newUser = {
                name: 'John Doe',
                roleId: 999,
                structureIds: [2, 3],
            }
            const response = await request(server)
                .post('/users')
                .set('user-id', '1')
                .send(newUser)
            expect(response.status).toBe(404)
            expect(response.body.message).toBe('Role not found')
        })

        it('should handle invalid structure ID', async () => {
            const newUser = {
                name: 'John Doe',
                roleId: 2,
                structureIds: [999, 1000],
            }
            const response = await request(server)
                .post('/users')
                .set('user-id', '1')
                .send(newUser)
            expect(response.status).toBe(404)
            expect(response.body.message).toBe('Structure not found')
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

        it('should handle validation errors', async () => {
            const invalidUser = {
                name: '',
                roleId: 2,
                structureIds: [3, 4],
            }
            const response = await request(server)
                .put('/users/3')
                .set('user-id', '1')
                .send(invalidUser)
            expect(response.status).toBe(400)
            expect(response.body.message).toBe('Validation failed')
        })

        it('should handle user not found errors', async () => {
            const updatedUser = {
                name: 'Jane Doe',
                roleId: 2,
                structureIds: [3, 4],
            }
            const response = await request(server)
                .put('/users/999')
                .set('user-id', '1')
                .send(updatedUser)
            expect(response.status).toBe(404)
            expect(response.body.message).toBe('User not found')
        })

        it('should handle server errors', async () => {
            jest.spyOn(
                AppDataSource.getRepository(User),
                'save'
            ).mockRejectedValue(new Error('Database error'))
            const updatedUser = {
                name: 'Jane Doe',
                roleId: 2,
                structureIds: [3, 4],
            }
            const response = await request(server)
                .put('/users/3')
                .set('user-id', '1')
                .send(updatedUser)
            expect(response.status).toBe(500)
            expect(response.body.message).toBe('Internal Server Error')
        })

        it('should handle invalid structure IDs', async () => {
            const updatedUser = {
                name: 'Jane Doe',
                roleId: 2,
                structureIds: [999, 1000],
            }
            const response = await request(server)
                .put('/users/6')
                .set('user-id', '1')
                .send(updatedUser)
            expect(response.status).toBe(404)
            expect(response.body.message).toBe('Structure not found')
        })

        it('should handle invalid role ID', async () => {
            const updatedUser = {
                name: 'Jane Doe',
                roleId: 999,
                structureIds: [3, 4],
            }
            const response = await request(server)
                .put('/users/6')
                .set('user-id', '1')
                .send(updatedUser)
            expect(response.status).toBe(404)
            expect(response.body.message).toBe('Role not found')
        })

        it('should handle updating non-existent user', async () => {
            const updatedUser = {
                name: 'Jane Doe',
                roleId: 2,
                structureIds: [3, 4],
            }
            const response = await request(server)
                .put('/users/999')
                .set('user-id', '1')
                .send(updatedUser)
            expect(response.status).toBe(404)
            expect(response.body.message).toBe('User not found')
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

        it('should handle user not found errors', async () => {
            const response = await request(server)
                .delete('/users/999')
                .set('user-id', '1')
            expect(response.status).toBe(404)
            expect(response.body.message).toBe('User not found')
        })

        it('should handle server errors', async () => {
            jest.spyOn(
                AppDataSource.getRepository(User),
                'remove'
            ).mockRejectedValue(new Error('Database error'))
            const response = await request(server)
                .delete('/users/5')
                .set('user-id', '1')
            expect(response.status).toBe(500)
            expect(response.body.message).toBe('Internal Server Error')
        })

        it('should handle deleting non-existent user', async () => {
            const response = await request(server)
                .delete('/users/999')
                .set('user-id', '1')
            expect(response.status).toBe(404)
            expect(response.body.message).toBe('User not found')
        })
    })
})
