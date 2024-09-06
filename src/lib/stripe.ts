import Stripe from "stripe";

if (!process.env.STRIPE_API_KEY) {
  throw new Error('STRIPE_API_KEY is not set in the environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2024-06-20",
  typescript: true,
});

// Log the API key type to ensure we're using the test key in development
console.log(`Using Stripe ${process.env.STRIPE_API_KEY.startsWith('sk_test') ? 'test' : 'live'} mode`);