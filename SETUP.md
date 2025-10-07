# E-Commerce Setup Guide

This guide will help you set up the e-commerce application with authentication and Stripe payments.

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Stripe account (for payments)

## Backend Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Set Up PostgreSQL Database

Create a new PostgreSQL database for the application:

```bash
createdb ecommerce
```

Or using psql:
```sql
CREATE DATABASE ecommerce;
```

### 3. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-this
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FRONTEND_URL=http://localhost:3000
```

**Getting Stripe Keys:**
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your "Secret key" (starts with `sk_test_`)
3. For webhook secret, see step 5 below

### 4. Generate and Run Database Migrations

```bash
npm run db:generate
npm run db:migrate
```

### 5. Set Up Stripe Webhook (for local testing)

Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
```

Login to Stripe CLI:
```bash
stripe login
```

Forward webhook events to your local server:
```bash
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

This will output a webhook signing secret (starts with `whsec_`). Copy this to your `.env` file as `STRIPE_WEBHOOK_SECRET`.

**Keep this terminal running while testing payments!**

### 6. Start the Backend Server

```bash
npm run dev
```

The server should start on http://localhost:3001

## Frontend Setup

### 1. Install Dependencies

```bash
cd ..  # Back to root directory
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3001
```

### 3. Start the Frontend

```bash
npm start
```

The app should open at http://localhost:3000

## Testing the Application

### 1. Register a New Account
- Navigate to http://localhost:3000/register
- Create an account with email and password

### 2. Add Items to Cart
- Browse products at http://localhost:3000/shop
- Add items to your cart

### 3. Test Checkout with Stripe

Use Stripe's test card numbers:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

**Failed Payment:**
- Card: `4000 0000 0000 0002`

### 4. View Orders
- After successful payment, check your orders at http://localhost:3000/orders

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Checkout
- `POST /api/checkout/create-session` - Create Stripe checkout session (requires auth)
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Orders
- `GET /api/orders` - Get user's orders (requires auth)

## Troubleshooting

### Database Connection Issues
- Make sure PostgreSQL is running: `pg_isready`
- Check your DATABASE_URL in `.env`
- Verify database exists: `psql -l`

### Stripe Webhook Not Working
- Make sure `stripe listen` is running in a separate terminal
- Check that STRIPE_WEBHOOK_SECRET in `.env` matches the output from `stripe listen`
- Verify the webhook endpoint is `/api/webhooks/stripe`

### Port Already in Use
- Backend (3001): Change PORT in `server/.env`
- Frontend (3000): The app will prompt you to use a different port

### CORS Errors
- Check that FRONTEND_URL in `server/.env` matches your frontend URL
- Make sure both servers are running

## Production Deployment Notes

For production deployment, you'll need to:

1. Set up a production PostgreSQL database
2. Configure real Stripe webhook endpoints (not using CLI)
3. Set production environment variables
4. Build the frontend: `npm run build`
5. Serve the built frontend with a web server
6. Use a process manager like PM2 for the backend

## Database Schema

### Users Table
- `id` (serial, primary key)
- `email` (varchar, unique)
- `password` (varchar, hashed)
- `name` (varchar, nullable)
- `created_at` (timestamp)

### Orders Table
- `id` (serial, primary key)
- `user_id` (integer, foreign key)
- `stripe_session_id` (varchar)
- `total` (decimal)
- `status` (varchar: pending, completed, failed)
- `created_at` (timestamp)

### Order Items Table
- `id` (serial, primary key)
- `order_id` (integer, foreign key)
- `product_id` (integer)
- `product_title` (varchar)
- `product_thumbnail` (text)
- `quantity` (integer)
- `price` (decimal)
- `discount_percentage` (decimal)
