import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Loading } from "../components/Loading";
import { EmptyState } from "../components/EmptyState";
import { drawApi } from "../services/draw.api";
import { getApiError } from "../lib/api";
import { dateOnly, money } from "../lib/format";
import type { Winner } from "../types";

export function WinningsPage() {
  const [items, setItems] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [proof, setProof] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    drawApi.winnings().then(setItems).catch(err => setError(getApiError(err))).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="My Winnings" subtitle="Track matched draws, verification and payment status." />
      {error && <div className="alert error">{error}</div>}
      {loading ? <Loading /> : items.length === 0 ? <EmptyState title="No winnings yet" text="Winning entries will appear here after a draw is processed." /> : (
        <div className="card">
          <div className="table-wrap">
            <table><thead><tr><th>Draw</th><th>Matches</th><th>Prize</th><th>Verification</th><th>Payment</th><th>Proof</th></tr></thead>
            <tbody>{items.map(w => (
              <tr key={w._id}>
                <td>{typeof w.draw === "object" ? dateOnly(w.draw.drawDate) : w.draw}</td>
                <td><strong>{w.matchCount}/5</strong></td>
                <td>{money(w.prizeAmount)}</td>
                <td><span className={`status ${w.verificationStatus.toLowerCase()}`}>{w.verificationStatus}</span></td>
                <td><span className={`status ${w.paymentStatus.toLowerCase()}`}>{w.paymentStatus}</span></td>
                <td>
                  {w.proofUrl ? <a href={w.proofUrl} target="_blank" rel="noreferrer">View proof</a> : <span className="muted">Submit through API</span>}
                </td>
              </tr>
            ))}</tbody></table>
          </div>
          <div className="info-box">
            <Trophy size={18}/>
            <span>The current backend exposes winner proof submission as a service capability, but no user-facing proof-upload route. This UI therefore displays proof when available and leaves upload to the backend enhancement.</span>
          </div>
        </div>
      )}
    </>
  );
}
