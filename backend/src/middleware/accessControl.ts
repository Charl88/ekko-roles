import { Request, Response, NextFunction } from 'express'
import { In } from 'typeorm'
import { AppDataSource } from '../dataSource'
import { User } from '../entities/user'
import { Structure } from '../entities/structure'

export const accessControl = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const userId = req.headers['user-id'] as string // Simulate authenticated user
        if (!userId)
            return res.status(401).json({ code: 401, message: 'Unauthorized' })

        const user = await AppDataSource.getRepository(User).findOne({
            where: { id: parseInt(userId) },
            relations: ['role', 'structures'],
        })
        if (!user)
            // We return 500 here to prevent someone spoofing auth headers to
            // find data about existing users
            return res
                .status(500)
                .json({ code: 500, message: 'Internal Server Error' })
        res.locals.user = user
    } catch (error) {
        return res
            .status(500)
            .json({ code: 500, message: 'Internal Server Error' })
    }
    next()
}

export const canCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const user = res.locals.user
        const { structureIds } = req.body

        // Only managers can create users
        if (user.role.id !== 1) {
            return res.status(403).json({ code: 403, message: 'Forbidden' })
        }

        const allDescendants = new Set<Structure>()
        for (const structure of user.structures) {
            const descendants = await AppDataSource.manager
                .getTreeRepository(Structure)
                .findDescendants(structure)

            descendants.forEach((descendant) => {
                if (descendant.id !== structure.id) {
                    allDescendants.add(descendant)
                }
            })
        }

        const intendedStructures = await AppDataSource.getRepository(
            Structure
        ).find({ where: { id: In(structureIds) } })
        if (
            !intendedStructures.every((structure) =>
                Array.from(allDescendants).some(
                    (descendant) => descendant.id === structure.id
                )
            )
        ) {
            return res.status(403).json({ code: 403, message: 'Forbidden' })
        }
    } catch (error) {
        return res
            .status(500)
            .json({ code: 500, message: 'Internal Server Error' })
    }
    next()
}

export const canEdit = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    try {
        const user = res.locals.user
        const targetUserId = parseInt(req.params.id)

        // Only managers can edit users
        if (user.role.id !== 1) {
            return res.status(403).json({ code: 403, message: 'Forbidden' })
        }

        const targetUser = await AppDataSource.getRepository(User).findOne({
            where: { id: targetUserId },
            relations: ['structures', 'role'],
        })

        if (!targetUser) {
            return res
                .status(404)
                .json({ code: 404, message: 'User not found' })
        }

        res.locals.targetUser = targetUser

        const allDescendants = new Set<Structure>()
        for (const structure of user.structures) {
            const descendants = await AppDataSource.manager
                .getTreeRepository(Structure)
                .findDescendants(structure)

            descendants.forEach((descendant) => {
                if (descendant.id !== structure.id) {
                    allDescendants.add(descendant)
                }
            })
        }

        if (
            !targetUser.structures.some((structure) =>
                Array.from(allDescendants).some(
                    (descendant) => descendant.id === structure.id
                )
            )
        ) {
            return res.status(403).json({ code: 403, message: 'Forbidden' })
        }
    } catch (error) {
        return res
            .status(500)
            .json({ code: 500, message: 'Internal Server Error' })
    }
    next()
}
