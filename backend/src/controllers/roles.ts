import { Request, Response } from 'express'
import { AppDataSource } from '../dataSource'
import { Role } from '../entities/role'

export const getRoles = async (_req: Request, res: Response) => {
    const roles = await AppDataSource.getRepository(Role).find()
    res.json(roles)
}

export const getRole = async (req: Request, res: Response) => {
    const role = await AppDataSource.getRepository(Role).findOneBy({
        id: parseInt(req.params.id),
    })
    res.json(role)
}

export const createRole = async (req: Request, res: Response) => {
    const role = AppDataSource.getRepository(Role).create(req.body)
    const result = await AppDataSource.getRepository(Role).save(role)
    res.status(201).json(result)
}

export const updateRole = async (req: Request, res: Response) => {
    const role = await AppDataSource.getRepository(Role).findOneBy({
        id: parseInt(req.params.id),
    })
    if (role) {
        AppDataSource.getRepository(Role).merge(role, req.body)
        const result = await AppDataSource.getRepository(Role).save(role)
        res.json(result)
    } else {
        res.status(404).json({ message: 'Role not found' })
    }
}

export const deleteRole = async (req: Request, res: Response) => {
    const result = await AppDataSource.getRepository(Role).delete(req.params.id)
    res.json(result)
}
