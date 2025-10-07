import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import checkoutRoutes from './routes/checkout';
import orderRoutes from './routes/orders';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));

// For Stripe webhooks - raw body parser must be before express.json()
app.use('/api/checkout/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
