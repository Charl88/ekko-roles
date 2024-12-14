import { Request, Response } from 'express'
import { In } from 'typeorm'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { CreateUserDto } from '../dto/users/createUser.dto'
import { AppDataSource } from '../dataSource'
import { User } from '../entities/user'
import { Structure } from '../entities/structure'
import { UpdateUserDto } from '../dto/users/updateUser.dto'
import { Role } from '../entities/role'

export const getUsers = async (_req: Request, res: Response) => {
    const user = res.locals.user

    try {
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

        const users = await AppDataSource.getRepository(User).find({
            where: {
                structures: {
                    id: In(Array.from(allDescendants).map((s) => s.id)),
                },
            },
            relations: ['role', 'structures'],
        })

        res.status(200).json(users)
    } catch (error) {
        console.error('Error fetching users:', error)
        res.status(500).json({ code: 500, message: 'Internal Server Error' })
    }
}

export const createUser = async (req: Request, res: Response) => {
    const createUserDto = plainToInstance(CreateUserDto, req.body)
    const errors = await validate(createUserDto)

    if (errors.length > 0) {
        res.status(400).json({
            code: 400,
            message: 'Validation failed',
            errors,
        })
    }

    const { name, roleId, structureIds } = createUserDto

    try {
        const structures = await AppDataSource.getRepository(Structure).find({
            where: { id: In(structureIds) },
        })
        const newUser = AppDataSource.getRepository(User).create({
            name,
            role: { id: roleId },
            structures,
        })
        await AppDataSource.getRepository(User).save(newUser)
        res.status(201).json(newUser)
    } catch (error) {
        console.error('Error creating user:', error)
        res.status(500).json({ code: 500, message: 'Internal Server Error' })
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params

    const updateUserDto = plainToInstance(UpdateUserDto, req.body)
    const errors = await validate(updateUserDto)

    if (errors.length > 0) {
        res.status(400).json({
            code: 400,
            message: 'Validation failed',
            errors,
        })
    }

    const { name, roleId, structureIds } = updateUserDto

    try {
        const userToUpdate = await AppDataSource.getRepository(User).findOne({
            where: { id: parseInt(id) },
        })
        if (!userToUpdate) {
            res.status(404).json({ code: 404, message: 'User not found' })
            return
        }

        const structures = await AppDataSource.getRepository(Structure).find({
            where: { id: In(structureIds) },
        })
        const role = await AppDataSource.getRepository(Role).findOne({
            where: { id: roleId },
        })
        if (!role) {
            res.status(404).json({ code: 404, message: 'Role not found' })
            return
        }
        userToUpdate.name = name
        userToUpdate.role = role
        userToUpdate.structures = structures

        await AppDataSource.getRepository(User).save(userToUpdate)
        res.status(200).json(userToUpdate)
    } catch (error) {
        console.error('Error updating user:', error)
        res.status(500).json({ code: 500, message: 'Internal Server Error' })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const userToDelete = await AppDataSource.getRepository(User).findOne({
            where: { id: parseInt(id) },
        })
        if (!userToDelete) {
            res.status(404).json({ code: 404, message: 'User not found' })
            return
        }

        await AppDataSource.getRepository(User).remove([userToDelete])
        res.status(200).json({
            code: 200,
            message: 'User deleted successfully',
        })
    } catch (error) {
        console.error('Error deleting user:', error)
        res.status(500).json({ code: 500, message: 'Internal Server Error' })
    }
}