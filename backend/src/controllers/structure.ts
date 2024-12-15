import { Request, Response } from 'express'
import { AppDataSource } from '../dataSource'
import { Structure } from '../entities/structure'

export const getStructures = async (_req: Request, res: Response) => {
    const structures = await AppDataSource.getRepository(Structure).find({
        relations: ['parent'],
    })
    res.json(structures)
}

export const getStructure = async (req: Request, res: Response) => {
    const structure = await AppDataSource.getRepository(Structure).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: ['parent'],
    })
    res.json(structure)
}

export const createStructure = async (req: Request, res: Response) => {
    const structure = AppDataSource.getRepository(Structure).create(req.body)
    const result = await AppDataSource.getRepository(Structure).save(structure)
    res.status(201).json(result)
}

export const updateStructure = async (req: Request, res: Response) => {
    const structure = await AppDataSource.getRepository(Structure).findOneBy({
        id: parseInt(req.params.id),
    })
    if (structure) {
        AppDataSource.getRepository(Structure).merge(structure, req.body)
        const result =
            await AppDataSource.getRepository(Structure).save(structure)
        res.json(result)
    } else {
        res.status(404).json({ message: 'Structure not found' })
    }
}

export const deleteStructure = async (req: Request, res: Response) => {
    const result = await AppDataSource.getRepository(Structure).delete(
        req.params.id
    )
    res.json(result)
}
