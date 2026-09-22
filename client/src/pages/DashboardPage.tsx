import { useEffect, useState } from "react";
import { BarChart3, Heart, Ticket, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { Loading } from "../components/Loading";
import { scoreApi } from "../services/score.api";
import { drawApi } from "../services/draw.api";
import { charityApi } from "../services/charity.api";
import { subscriptionApi } from "../services/subscription.api";
import { useAuth } from "../context/AuthContext";
import { dateOnly, money } from "../lib/format";
import type { Draw, Score, Subscription, CharitySelection } from "../types";

export function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<{
    scores: Score[];
    draw: Draw | null;
    subscription: Subscription | null;
    charity: CharitySelection | null;
  } | null>(null);

  useEffect(() => {
    Promise.all([scoreApi.list(), drawApi.current(), subscriptionApi.current(), charityApi.mine()])
      .then(([scores, draw, subscription, charity]) => setData({ scores, draw, subscription, charity }))
      .catch(() => setData({ scores: [], draw: null, subscription: null, charity: null }));
  }, []);

  if (!data) return <Loading />;

  return (
    <>
      <PageHeader title={`Hello, ${user?.name?.split(" ")[0] || "Hero"} 👋`} subtitle="Your Digital Heroes overview." />
      <div className="stats-grid">
        <StatCard label="Saved scores" value={`${data.scores.length}/5`} icon={<BarChart3 />} />
        <StatCard label="Subscription" value={data.subscription?.status || "None"} icon={<Ticket />} />
        <StatCard label="Charity" value={data.charity?.charityName || "Not selected"} icon={<Heart />} />
        <StatCard label="Current draw" value={data.draw ? dateOnly(data.draw.drawDate) : "Not created"} icon={<Trophy />} />
      </div>

      <div className="dashboard-grid">
        <section className="card hero-card">
          <div>
            <span className="eyebrow">CURRENT DRAW</span>
            <h2>{data.draw ? dateOnly(data.draw.drawDate) : "No current draw"}</h2>
            <p>{data.draw ? `Prize pool ${money(data.draw.prizePoolAmount)}` : "Check back after an administrator creates a draw."}</p>
          </div>
          <Link className="btn btn-primary" to="/draws">View draws</Link>
        </section>

        <section className="card">
          <div className="section-title"><h2>Quick actions</h2></div>
          <div className="quick-actions">
            <Link to="/scores" className="action-link"><BarChart3 /> Manage scores</Link>
            <Link to="/charity" className="action-link"><Heart /> Choose charity</Link>
            <Link to="/subscription" className="action-link"><Ticket /> Manage subscription</Link>
            <Link to="/winnings" className="action-link"><Trophy /> View winnings</Link>
          </div>
        </section>
      </div>
    </>
  );
}
