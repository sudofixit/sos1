import Stripe from "stripe";
import { CONFIG } from "../config";
import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";

const stripe = CONFIG.STRIPE_SECRET_KEY
  ? new Stripe(CONFIG.STRIPE_SECRET_KEY)
  : null;

export async function verifyAndParseEvent(payload: string, signature?: string) {
  if (!stripe) throw new Error("Stripe not configured");
  if (!CONFIG.STRIPE_WEBHOOK_SECRET)
    throw new Error("Webhook secret not configured");
  // Bun requires async verification due to SubtleCrypto
  return await stripe.webhooks.constructEventAsync(
    payload,
    signature || "",
    CONFIG.STRIPE_WEBHOOK_SECRET
  );
}

export async function handleStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const sosRequestId =
        (session.metadata?.sosRequestId as string) || undefined;
      const paymentIntentId = session.payment_intent as string | null;

      if (sosRequestId) {
        await prisma.sOSRequest.update({
          where: { id: sosRequestId },
          data: {
            paymentIntentId: paymentIntentId || undefined,
            status: "ASSIGNED",
          },
        });
      } else if (session.id) {
        await prisma.sOSRequest.updateMany({
          where: { stripeSessionId: session.id },
          data: {
            paymentIntentId: paymentIntentId || undefined,
            status: "ASSIGNED",
          },
        });
      }

      logger.info(
        { sessionId: session.id, paymentIntentId },
        "checkout.session.completed"
      );
      break;
    }
    case "payment_intent.amount_capturable_updated": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const sosRequestId = intent.metadata?.sosRequestId as string | undefined;

      if (sosRequestId) {
        await prisma.sOSRequest.update({
          where: { id: sosRequestId },
          data: { paymentIntentId: intent.id },
        });
      } else {
        await prisma.sOSRequest.updateMany({
          where: { paymentIntentId: intent.id },
          data: { status: "ASSIGNED" },
        });
      }
      logger.info({ paymentIntentId: intent.id }, "amount capturable updated");
      break;
    }
    case "payment_intent.canceled": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await prisma.sOSRequest.updateMany({
        where: { paymentIntentId: intent.id },
        data: { status: "CANCELED" },
      });
      logger.info({ paymentIntentId: intent.id }, "payment canceled");
      break;
    }
    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await prisma.sOSRequest.updateMany({
        where: { paymentIntentId: intent.id },
        data: { status: "COMPLETED" },
      });
      logger.info({ paymentIntentId: intent.id }, "payment succeeded");
      break;
    }
    default: {
      logger.debug({ type: event.type }, "Unhandled Stripe event type");
      break;
    }
  }
}
