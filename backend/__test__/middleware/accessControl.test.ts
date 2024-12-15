import { Request, Response, NextFunction } from 'express'
import { AppDataSource } from '../../src/dataSource'
import {
    accessControl,
    canCreate,
    canEdit,
} from '../../src/middleware/accessControl'
import { User } from '../../src/entities/user'

describe('accessControl Middleware', () => {
    let req: Partial<Request>
    let res: Partial<Response>
    let next: NextFunction

    beforeEach(async () => {
        await AppDataSource.initialize()
        await AppDataSource.runMigrations()

        req = {
            headers: {},
            body: {},
        }
        res = {
            locals: {},
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
        next = jest.fn()
    })

    afterEach(async () => {
        jest.restoreAllMocks()
        await AppDataSource.dropDatabase()
        await AppDataSource.destroy()
    })

    describe('accessControl', () => {
        it('should set user in res.locals if user exists', async () => {
            req.headers = { 'user-id': '1' }
            await accessControl(req as Request, res as Response, next)
            expect(res.locals!.user).toBeDefined()
            expect(next).toHaveBeenCalled()
        })

        it('should return 401 if user-id header is missing', async () => {
            await accessControl(req as Request, res as Response, next)
            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.json).toHaveBeenCalledWith({
                code: 401,
                message: 'Unauthorized',
            })
            expect(next).not.toHaveBeenCalled()
        })

        it('should return 500 if user does not exist', async () => {
            req.headers = { 'user-id': '999' }
            await accessControl(req as Request, res as Response, next)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                code: 500,
                message: 'Internal Server Error',
            })
            expect(next).not.toHaveBeenCalled()
        })

        it('should handle an unexpected error', async () => {
            req.headers = { 'user-id': '1' }
            jest.spyOn(
                AppDataSource.getRepository(User),
                'findOne'
            ).mockRejectedValue(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                new Error('Unexpected error')
            )
            await accessControl(req as Request, res as Response, next)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                code: 500,
                message: 'Internal Server Error',
            })
            expect(next).not.toHaveBeenCalled()
        })
    })

    describe('canCreate', () => {
        it('should return 403 if user is not a manager', async () => {
            // Create employee user
            res.locals!.user = await AppDataSource.getRepository(User).save({
                name: 'Alice',
                role: { id: 2 },
                structures: [{ id: 1 }],
            })
            req.body.structureIds = [1]
            await canCreate(req as Request, res as Response, next)
            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.json).toHaveBeenCalledWith({
                code: 403,
                message: 'Forbidden',
            })
            expect(next).not.toHaveBeenCalled()
        })

        it('should return 403 if user does not have access to intended structure', async () => {
            // Create manager user
            res.locals!.user = await AppDataSource.getRepository(User).save({
                name: 'Alice',
                role: { id: 1 },
                structures: [{ id: 3 }],
            })
            req.body = { structureIds: [2] }
            await canCreate(req as Request, res as Response, next)
            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.json).toHaveBeenCalledWith({
                code: 403,
                message: 'Forbidden',
            })
            expect(next).not.toHaveBeenCalled()
        })

        it('should call next if user is a manager and has access to intended structures', async () => {
            // Create employee user
            res.locals!.user = await AppDataSource.getRepository(User).save({
                name: 'Alice',
                role: { id: 1 },
                structures: [{ id: 1 }],
            })
            req.body = { structureIds: [2] }
            await canCreate(req as Request, res as Response, next)
            expect(next).toHaveBeenCalled()
        })

        it('should handle an unexpected error', async () => {
            req.body = { structureIds: [2] }
            jest.spyOn(AppDataSource, 'getTreeRepository').mockRejectedValue(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                new Error('Unexpected error')
            )
            await canCreate(req as Request, res as Response, next)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                code: 500,
                message: 'Internal Server Error',
            })
            expect(next).not.toHaveBeenCalled()
        })
    })

    describe('canEdit', () => {
        it('should return 403 if user is not a manager', async () => {
            // Create employee user
            res.locals!.user = await AppDataSource.getRepository(User).save({
                name: 'Alice',
                role: { id: 2 },
                structures: [{ id: 1 }],
            })
            req.params = { id: '1' }
            await canEdit(req as Request, res as Response, next)
            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.json).toHaveBeenCalledWith({
                code: 403,
                message: 'Forbidden',
            })
            expect(next).not.toHaveBeenCalled()
        })

        it('should return 403 if user does not have access to intended structure', async () => {
            // Create manager user
            res.locals!.user = await AppDataSource.getRepository(User).save({
                name: 'Alice',
                role: { id: 1 },
                structures: [{ id: 3 }],
            })
            req.params = { id: '1' }
            await canEdit(req as Request, res as Response, next)
            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.json).toHaveBeenCalledWith({
                code: 403,
                message: 'Forbidden',
            })
            expect(next).not.toHaveBeenCalled()
        })

        it("should call next if user is a manager and has access to target user's structures", async () => {
            // Create manager user
            res.locals!.user = await AppDataSource.getRepository(User).save({
                name: 'Alice',
                role: { id: 1 },
                structures: [{ id: 1 }],
            })
            req.params = { id: '2' }
            await canEdit(req as Request, res as Response, next)
            expect(next).toHaveBeenCalled()
        })

        it('should handle an unexpected error', async () => {
            req.params = { id: '2' }
            jest.spyOn(AppDataSource, 'getTreeRepository').mockRejectedValue(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                new Error('Unexpected error')
            )
            await canEdit(req as Request, res as Response, next)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                code: 500,
                message: 'Internal Server Error',
            })
            expect(next).not.toHaveBeenCalled()
        })
    })
})
