import api, { unwrap } from "../lib/api";
import type { Plan, Subscription } from "../types";

export const subscriptionApi = {
  plans() {
    return unwrap<Plan[]>(api.get("/subscriptions/plans"));
  },
  current() {
    return unwrap<Subscription | null>(api.get("/subscriptions/me"));
  },
  checkout(plan: "MONTHLY" | "YEARLY") {
    return unwrap<{ url: string }>(api.post("/subscriptions/checkout", { plan }));
  },
  cancel() {
    return unwrap<Subscription>(api.post("/subscriptions/cancel"));
  }
};
