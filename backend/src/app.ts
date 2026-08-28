import express, { type Express } from 'express';
import dotenv from 'dotenv';

//Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import storeRoutes from './routes/store.routes.js';
import ratingRoutes from './routes/rating.routes.js';

dotenv.config();
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
    res.json({ message: 'Welcome to Store Rating App API' });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/store", storeRoutes);
app.use("/api/v1/rating", ratingRoutes);


export default app;