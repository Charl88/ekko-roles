import { Router } from 'express'

import {
    createStructure,
    deleteStructure,
    getStructure,
    getStructures,
    updateStructure,
} from '../controllers/structure'

const router = Router()

router.get('/', getStructures)
router.get('/:id', getStructure)
router.post('/', createStructure)
router.put('/:id', updateStructure)
router.delete('/:id', deleteStructure)

export default router
