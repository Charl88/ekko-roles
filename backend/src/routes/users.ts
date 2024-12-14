import { Router } from 'express'
import { accessControl, canEdit, canCreate } from '../middleware/accessControl'

import {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
} from '../controllers/users'

const router = Router()

router.use(accessControl)
router.get('/', getUsers)
router.post('/', canCreate, createUser)
router.put('/:id', canEdit, updateUser)
router.delete('/:id', canEdit, deleteUser)

export default router
