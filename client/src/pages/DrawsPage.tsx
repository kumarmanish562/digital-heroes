import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Loading } from "../components/Loading";
import { EmptyState } from "../components/EmptyState";
import { drawApi } from "../services/draw.api";
import { getApiError } from "../lib/api";
import { dateOnly, money } from "../lib/format";
import type { Draw } from "../types";

export function DrawsPage() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    drawApi.list().then(setDraws).catch(err => setError(getApiError(err))).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Draws" subtitle="Browse published and simulated monthly draws." />
      {error && <div className="alert error">{error}</div>}
      {loading ? <Loading /> : draws.length === 0 ? <EmptyState title="No draws available" text="An administrator has not created a draw yet." /> : (
        <div className="draw-grid">
          {draws.map(draw => (
            <div className="card draw-card" key={draw._id}>
              <div className="draw-head"><div className="number-badge"><Ticket size={17} /></div><span className={`status ${draw.status.toLowerCase()}`}>{draw.status}</span></div>
              <h2>{dateOnly(draw.drawDate)}</h2>
              <p>Prize pool: <strong>{money(draw.prizePoolAmount)}</strong></p>
              <div className="number-row">{draw.numbers.map(n => <span key={n} className="number-badge large">{n}</span>)}</div>
              <Link className="btn btn-ghost full" to={`/draws/${draw._id}`}>View details</Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
