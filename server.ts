import express, { json } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client'

require('dotenv').config();

const prisma = new PrismaClient()
const app = express();
const port = process.env.PORT || 5000;

app.use(json());
app.use(cors());


async function main() {
  // Connect the client
  await prisma.$connect()
  app.use(express.json());

  // User routes
  app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
  });

  app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    res.json(user);
  });

  app.post('/users', async (req, res) => {
    const { username, password, email, pp } = req.body;
    const newUser = await prisma.user.create({
      data: { username, password, email, pp },
    });
    res.json(newUser);
  });

  app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password, email, pp } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { username, password, email, pp },
    });
    res.json(updatedUser);
  });

  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.sendStatus(204);
  });

  // Score routes
  app.get('/scores', async (req, res) => {
    const scores = await prisma.score.findMany();
    res.json(scores);
  });

  app.get('/scores/:id', async (req, res) => {
    const { id } = req.params;
    const score = await prisma.score.findUnique({
      where: { id: parseInt(id) },
    });
    res.json(score);
  });

  app.post('/scores', async (req, res) => {
    const { Userid, score, word } = req.body;
    const newScore = await prisma.score.create({
      data: { Userid, score, word },
    });
    res.json(newScore);
  });

  app.put('/scores/:id', async (req, res) => {
    const { id } = req.params;
    const { Userid, score, word } = req.body;
    const updatedScore = await prisma.score.update({
      where: { id: parseInt(id) },
      data: { Userid, score, word },
    });
    res.json(updatedScore);
  });

  app.delete('/scores/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.score.delete({
      where: { id: parseInt(id) },
    });
    res.sendStatus(204);
  });

  // weeklyTest routes
  app.get('/weeklyTests', async (req, res) => {
    const weeklyTests = await prisma.weeklyTest.findMany();
    res.json(weeklyTests);
  });

  app.get('/weeklyTests/:id', async (req, res) => {
    const { id } = req.params;
    const weeklyTest = await prisma.weeklyTest.findUnique({
      where: { id: parseInt(id) },
    });
    res.json(weeklyTest);
  });

  app.post('/weeklyTests', async (req, res) => {
    const { word } = req.body;
    const newWeeklyTest = await prisma.weeklyTest.create({
      data: { word },
    });
    res.json(newWeeklyTest);
  });

  app.put('/weeklyTests/:id', async (req, res) => {
    const { id } = req.params;
    const { word } = req.body;
    const updatedWeeklyTest = await prisma.weeklyTest.update({
      where: { id: parseInt(id) },
      data: { word },
    });
    res.json(updatedWeeklyTest);
  });

  app.delete('/weeklyTests/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.weeklyTest.delete({
      where: { id: parseInt(id) },
    });
    res.sendStatus(204);
  });

  // testScore routes
  app.get('/testScores', async (req, res) => {
    const testScores = await prisma.testScore.findMany();
    res.json(testScores);
  });

  app.get('/testScores/:scoreid/:userId', async (req, res) => {
    const { scoreid, userId } = req.params;
    const testScore = await prisma.testScore.findUnique({
      where: { scoreid_userId: { scoreid: parseInt(scoreid), userId: parseInt(userId) } },
    });
    res.json(testScore);
  });

  app.post('/testScores', async (req, res) => {
    const { scoreid, userId } = req.body;
    const newTestScore = await prisma.testScore.create({
      data: { scoreid, userId },
    });
    res.json(newTestScore);
  });

  app.put('/testScores/:scoreid/:userId', async (req, res) => {
    const { scoreid, userId } = req.params;
    const { newScoreId, newUserId } = req.body;
    const updatedTestScore = await prisma.testScore.update({
      where: { scoreid_userId: { scoreid: parseInt(scoreid), userId: parseInt(userId) } },
      data: { scoreid: newScoreId, userId: newUserId },
    });
    res.json(updatedTestScore);
  });

  app.delete('/testScores/:scoreid/:userId', async (req, res) => {
    const { scoreid, userId } = req.params;
    await prisma.testScore.delete({
      where: { scoreid_userId: { scoreid: parseInt(scoreid), userId: parseInt(userId) } },
    });
    res.sendStatus(204);
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })


