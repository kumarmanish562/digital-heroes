import { stripe } from "../config/stripe.js";
import { env } from "../config/env.js";
import { Subscription, type SubscriptionPlan } from "../models/Subscription.js";

const PLANS = {
  MONTHLY: { name: "Hero Monthly", amount: 499, currency: "INR", interval: "Monthly", features: ["Monthly draw entry", "Charity contribution", "Winner verification", "Member dashboard"] },
  YEARLY: { name: "Hero Yearly", amount: 4999, currency: "INR", interval: "Yearly", features: ["Everything in Monthly", "2 months effectively free", "Priority support", "Annual member status"] }
} as const;

export function getPlans() {
  return Object.entries(PLANS).map(([plan, value]) => ({ plan, ...value }));
}

export async function getCurrentSubscription(userId: string) {
  return Subscription.findOne({ user: userId }).sort({ createdAt: -1 }).lean();
}

function renewalDate(plan: SubscriptionPlan) {
  const date = new Date();
  if (plan === "MONTHLY") date.setMonth(date.getMonth() + 1);
  else date.setFullYear(date.getFullYear() + 1);
  return date;
}

export async function checkout(userId: string, email: string, plan: SubscriptionPlan) {
  const selected = PLANS[plan];
  if (!selected) throw Object.assign(new Error("Invalid subscription plan"), { status: 422, code: "INVALID_PLAN" });

  if (env.SUBSCRIPTION_PROVIDER === "stripe") {
    if (!stripe) throw Object.assign(new Error("Stripe is not configured on the server"), { status: 503, code: "STRIPE_NOT_CONFIGURED" });
    const priceId = plan === "MONTHLY" ? env.STRIPE_MONTHLY_PRICE_ID : env.STRIPE_YEARLY_PRICE_ID;
    if (!priceId) throw Object.assign(new Error(`Stripe ${plan.toLowerCase()} price id is missing`), { status: 503, code: "STRIPE_PRICE_MISSING" });
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${env.CLIENT_URL}/subscription?checkout=success`,
      cancel_url: `${env.CLIENT_URL}/subscription?checkout=cancelled`,
      metadata: { userId, plan }
    });
    await Subscription.create({ user: userId, plan, status: "PENDING", amount: selected.amount, currency: selected.currency, checkoutSessionId: session.id });
    return { url: session.url };
  }

  const existing = await Subscription.findOne({ user: userId, status: "ACTIVE" });
  if (existing) {
    existing.status = "CANCELLED";
    existing.cancelledAt = new Date();
    await existing.save();
  }
  const subscription = await Subscription.create({
    user: userId,
    plan,
    status: "ACTIVE",
    amount: selected.amount,
    currency: selected.currency,
    startDate: new Date(),
    renewalDate: renewalDate(plan)
  });
  return { url: `${env.CLIENT_URL}/subscription?checkout=success&subscription=${subscription._id}` };
}

export async function cancelSubscription(userId: string) {
  const subscription = await Subscription.findOne({ user: userId, status: "ACTIVE" }).sort({ createdAt: -1 });
  if (!subscription) throw Object.assign(new Error("No active subscription found"), { status: 404, code: "NO_ACTIVE_SUBSCRIPTION" });
  subscription.status = "CANCELLED";
  subscription.cancelledAt = new Date();
  await subscription.save();
  return subscription;
}
