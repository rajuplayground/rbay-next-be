import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth';
import sessionsRoutes from './routes/sessions';
import protectedRoutes from './routes/protected';
import visitorRoutes from './routes/visitor';
import { requireAuth } from './middleware/requireAuth';
import './config/redis';

const app = express();
const PORT = process.env.PORT || 4005;

// Middleware
app.use(
	cors({
		origin: process.env.FRONTEND_URL || 'http://localhost:3005',
		credentials: true
	})
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api', requireAuth, protectedRoutes);

// Health check
app.get('/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	console.log(`Health check: http://localhost:${PORT}/health`);
});
