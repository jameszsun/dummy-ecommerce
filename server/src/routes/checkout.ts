import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { db } from '../db';
import { orders, orderItems } from '../db/schema';

dotenv.config();

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

interface CartItem {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  quantity: number;
}

// Create Stripe checkout session
router.post('/create-session', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { cartItems } = req.body as { cartItems: CartItem[] };

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate line items for Stripe
    const lineItems = cartItems.map((item) => {
      const discountedPrice = item.price * (1 - item.discountPercentage / 100);
      const priceInCents = Math.round(discountedPrice * 100);

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            images: [item.thumbnail],
          },
          unit_amount: priceInCents,
        },
        quantity: item.quantity,
      };
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      metadata: {
        userId: req.userId!.toString(),
        cartItems: JSON.stringify(cartItems),
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Stripe webhook handler
router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const userId = parseInt(session.metadata?.userId || '0');
      const cartItems = JSON.parse(session.metadata?.cartItems || '[]') as CartItem[];

      // Calculate total
      const total = cartItems.reduce((sum, item) => {
        const discountedPrice = item.price * (1 - item.discountPercentage / 100);
        return sum + (discountedPrice * item.quantity);
      }, 0);

      // Create order
      const [order] = await db.insert(orders).values({
        userId,
        stripeSessionId: session.id,
        total: total.toFixed(2),
        status: 'completed',
      }).returning();

      // Create order items
      const orderItemsData = cartItems.map((item) => ({
        orderId: order.id,
        productId: item.id,
        productTitle: item.title,
        productThumbnail: item.thumbnail,
        quantity: item.quantity,
        price: item.price.toFixed(2),
        discountPercentage: item.discountPercentage.toFixed(2),
      }));

      await db.insert(orderItems).values(orderItemsData);

      console.log('Order created successfully:', order.id);
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  }

  res.json({ received: true });
});

export default router;
