import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Loading } from "../components/Loading";
import { drawApi } from "../services/draw.api";
import { getApiError } from "../lib/api";
import { dateOnly, money } from "../lib/format";
import type { Draw } from "../types";

export function DrawDetailsPage() {
  const { id } = useParams();
  const [draw, setDraw] = useState<Draw | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    drawApi.details(id).then(setDraw).catch(err => setError(getApiError(err))).catch(() => {});
  }, [id]);

  if (error) return <div className="alert error">{error}</div>;
  if (!draw) return <Loading />;

  return (
    <>
      <PageHeader title={`Draw · ${dateOnly(draw.drawDate)}`} subtitle={`Status: ${draw.status}`} action={<Link to="/draws" className="btn btn-ghost"><ArrowLeft size={17}/> Back</Link>} />
      <div className="card center-card">
        <span className="eyebrow">WINNING NUMBERS</span>
        <div className="number-row big">{draw.numbers.map(n => <span className="number-badge huge" key={n}>{n}</span>)}</div>
        <div className="detail-stats">
          <div><span>Prize pool</span><strong>{money(draw.prizePoolAmount)}</strong></div>
          <div><span>Published</span><strong>{draw.publishedAt ? dateOnly(draw.publishedAt) : "Not published"}</strong></div>
        </div>
      </div>
    </>
  );
}
