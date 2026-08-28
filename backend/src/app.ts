import express, { type Express } from 'express';
import dotenv from 'dotenv';

//Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();
const app: Express = express();

app.use(express.json());

// Routes
app.get('/', async (req, res) => {
    res.json({ message: 'Welcome to Store Rating App API' });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);


export default app;