import express, { type Express } from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";

//Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import storeRoutes from './routes/store.routes.js';
import ratingRoutes from './routes/rating.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import { config } from './config/env.js';

dotenv.config();
const app: Express = express();

app.use(
    cors({
        origin: config.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', async (req, res) => {
    res.json({ message: 'Welcome to Store Rating App API' });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/store", storeRoutes);
app.use("/api/v1/rating", ratingRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

export default app;