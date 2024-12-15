import { Response } from 'express'

export const handleMiddlewareError = (
    res: Response,
    error: Error | null,
    statusCode: number,
    message: string
) => {
    console.error(error)
    return res.status(statusCode).json({ code: statusCode, message })
}
