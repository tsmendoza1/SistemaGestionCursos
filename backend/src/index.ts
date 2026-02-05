import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cursosRouter from './routes/cursos';
import { healthCheck, metricsMiddleware } from './middleware/monitoring';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', healthCheck);

// Routes
app.use('/cursos', cursosRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
