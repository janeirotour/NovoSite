import Stripe from 'stripe';

function getCredentials(): { secretKey: string } {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY environment variable is not set. ' +
      'Add it via the Secrets tab in Replit.'
    );
  }

  return { secretKey };
}

export function getUncachableStripeClient(): Stripe {
  const { secretKey } = getCredentials();
  return new Stripe(secretKey, { apiVersion: '2025-08-27.basil' as any });
}
