import { buffer } from "micro";
import Stripe from "stripe";
import { getDb } from "../../../src/lib/db";

export const config = { api: { bodyParser: false } };

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" }) : null;

export default async function handler(req, res) {
  if (!stripe) return res.status(500).send("Stripe not configured");
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);
  let event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const db = getDb();

  // Handle the event types you care about
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      // Here you should map subscription.customer to your user and update DB
      // Example placeholder:
      // await db.subscription.upsert(...)

      break;
    }
    case "invoice.payment_succeeded": {
      // handle successful payment
      break;
    }
    case "invoice.payment_failed": {
      // handle failed payment
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}
