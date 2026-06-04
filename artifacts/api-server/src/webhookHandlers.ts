import { getStripeSync } from './stripeClient';
import { updateReservationBySessionId } from './routes/reservations';
import { sendAdminBookingNotification, sendCustomerConfirmation } from './lib/email';
import { logger } from './lib/logger';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    try {
      const sync = await getStripeSync();
      await sync.processWebhook(payload, signature);
    } catch (err) {
      logger.warn({ err }, 'StripeSync.processWebhook skipped');
    }

    let event: { type: string; data: { object: Record<string, unknown> } };
    try {
      event = JSON.parse(payload.toString()) as typeof event;
    } catch {
      throw new Error('Invalid webhook payload');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as {
        id: string;
        payment_intent: string | null;
        payment_status: string;
      };

      logger.info({ sessionId: session.id }, 'Processing checkout.session.completed');

      const updated = await updateReservationBySessionId(session.id, {
        paymentStatus: 'paid',
        bookingStatus: 'pending_confirmation',
        stripePaymentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
      });

      if (updated) {
        const emailData = {
          ...updated,
          basePrice: Number(updated.basePrice),
          extrasTotal: Number(updated.extrasTotal),
          totalAmount: Number(updated.totalAmount),
          selectedExtras: (updated.selectedExtras as Array<{ id: number; name: string; price: number; currency: string }>) ?? [],
        };

        await Promise.all([
          sendAdminBookingNotification(emailData),
          sendCustomerConfirmation(emailData),
        ]);
      } else {
        logger.warn({ sessionId: session.id }, 'No reservation found for Stripe session');
      }
    }
  }
}
