import type { Context } from "hono";
import {
  verifyAndParseEvent,
  handleStripeEvent,
} from "../services/webhookService";

export async function stripeWebhookHandler(c: Context) {
  try {
    const sig = c.req.header("stripe-signature");
    const payload = await c.req.text();
    const event = await verifyAndParseEvent(payload, sig);
    await handleStripeEvent(event);
    return c.json({ received: true });
  } catch (error: any) {
    return c.json({ error: error.message || "Webhook error" }, 400);
  }
}
