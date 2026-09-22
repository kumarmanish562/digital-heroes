import { useEffect, useState } from "react";
import { Check, CreditCard } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Loading } from "../components/Loading";
import { subscriptionApi } from "../services/subscription.api";
import { getApiError } from "../lib/api";
import { money, dateOnly } from "../lib/format";
import type { Plan, Subscription } from "../types";

export function SubscriptionPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [current, setCurrent] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const [p, s] = await Promise.all([subscriptionApi.plans(), subscriptionApi.current()]);
      setPlans(p); setCurrent(s);
    } catch (err) { setError(getApiError(err)); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function checkout(plan: "MONTHLY" | "YEARLY") {
    setBusy(plan); setError("");
    try {
      const { url } = await subscriptionApi.checkout(plan);
      if (url) window.location.href = url;
      else setError("Checkout URL was not returned.");
    } catch (err) { setError(getApiError(err)); }
    finally { setBusy(""); }
  }

  async function cancel() {
    if (!confirm("Cancel your current subscription?")) return;
    setBusy("cancel");
    try { await subscriptionApi.cancel(); await load(); }
    catch (err) { setError(getApiError(err)); }
    finally { setBusy(""); }
  }

  if (loading) return <Loading />;

  return (
    <>
      <PageHeader title="Subscription" subtitle="Manage your Digital Heroes membership." />
      {error && <div className="alert error">{error}</div>}
      {current && (
        <div className="card current-sub">
          <div><span className="eyebrow">CURRENT PLAN</span><h2>{current.plan}</h2><p>Status: <strong>{current.status}</strong> · Renews {dateOnly(current.renewalDate)}</p></div>
          {current.status === "ACTIVE" && <button className="btn btn-danger" disabled={busy === "cancel"} onClick={cancel}>{busy === "cancel" ? "Cancelling..." : "Cancel subscription"}</button>}
        </div>
      )}
      <div className="plan-grid">
        {plans.map(plan => (
          <div className="card plan-card" key={plan.plan}>
            <div className="plan-top"><span className="badge">{plan.interval}</span><CreditCard size={22} /></div>
            <h2>{plan.name}</h2>
            <div className="price">{money(plan.amount, plan.currency)} <small>/ {plan.interval.toLowerCase()}</small></div>
            <ul>{plan.features?.map(f => <li key={f}><Check size={16} />{f}</li>)}</ul>
            <button className="btn btn-primary full" onClick={() => checkout(plan.plan)} disabled={Boolean(busy)}>
              {busy === plan.plan ? "Opening checkout..." : `Choose ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
