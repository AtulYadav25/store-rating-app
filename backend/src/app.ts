import express, { type Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app: Express = express();

app.use(express.json());

// Routes
app.get('/', async (req, res) => {
    res.json({ message: 'Welcome to Store Rating App API' });
});

export default app;