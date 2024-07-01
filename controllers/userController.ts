
import { PrismaClient } from '@prisma/client';
import express, { Router } from 'express';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const secretKey = process.env.SECRET_KEY || 'my-secret-key';

const prisma = new PrismaClient()
const app = express();
const router = express.Router();

const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Could not get users' });
    }
};

// Register a new user
const registerController = async (req: Request, res: Response) => {
    const { username, email, password, phone } = req.body;

    if (!email || !username || !password || !phone) {
        res.status(400).json({ error: 'Missing email, username, phone or password' });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                phone
            },
        });

        const token = jwt.sign({ userId: user.id }, secretKey);

        res.status(201).json({ token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Could not register user' });
    }
};

// Log in an existing user
const loginController = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ error: 'Missing username or password' });
        return;
    }

    try {
        const user = await prisma.user.findFirst({ where: { username: username } })

        if (!user) {
            res.status(401).json({ error: 'Invalid username or password' });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            res.status(401).json({ error: 'Wrong password' });
            return;
        }

        const token = jwt.sign({ userId: user.id }, secretKey);

        res.status(200).json({ token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Could not log in user' });
    }
};

//Update user
export const updateUser = async (req: Request, res: Response) => {
    const { id, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                username,
                password: hashedPassword,

            },
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Could not update user' });
    }
};

module.exports = {
    registerController,
    loginController,
    getUsers,
    updateUser
}