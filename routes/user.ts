import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
const app = express();
const router = express.Router();
const userController = require('../controllers/userController')

router.get('/', userController.getUsers)
router.post('/register', userController.registerController)
router.post('/login', userController.loginController)
router.post('/update/:id', userController.updateUser)

module.exports = router;