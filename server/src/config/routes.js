import express from 'express'
import { login, me, jwtMdw } from '../middleware/auth'

const router = express.Router({ mergeParams: true })

// auth
router.post('/api/login', login)
router.get('/api/me', jwtMdw, me)

// resources
router.use('/api/user', require('../resources/user').default)

export default router
