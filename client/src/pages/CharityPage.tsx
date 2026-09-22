import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Loading } from "../components/Loading";
import { charityApi } from "../services/charity.api";
import { getApiError } from "../lib/api";
import type { Charity, CharitySelection } from "../types";

export function CharityPage() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [mine, setMine] = useState<CharitySelection | null>(null);
  const [percentage, setPercentage] = useState(10);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([charityApi.list(), charityApi.mine()])
      .then(([items, current]) => {
        setCharities(items);
        setMine(current);
        if (current) {
          setSelected(current.charityId);
          setPercentage(current.contributionPercentage);
        }
      })
      .catch(err => setError(getApiError(err)))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    if (!selected) return setError("Please choose a charity.");
    setSaving(true); setError("");
    try {
      const result = await charityApi.select({ charityId: selected, contributionPercentage: percentage });
      setMine(result);
    } catch (err) {
      setError(getApiError(err));
    } finally { setSaving(false); }
  }

  if (loading) return <Loading />;

  return (
    <>
      <PageHeader title="Charity" subtitle="Choose a cause and set the contribution percentage." />
      {error && <div className="alert error">{error}</div>}
      <div className="charity-grid">
        {charities.filter(c => c.active).map(c => (
          <button key={c._id} className={`charity-card ${selected === c._id ? "selected" : ""}`} onClick={() => setSelected(c._id)}>
            {c.image ? <img src={c.image} alt="" /> : <div className="charity-placeholder"><Heart /></div>}
            <div>
              <h3>{c.name}</h3>
              <p>{c.description || "Community charity partner."}</p>
              {c.website && <a href={c.website} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>Website</a>}
            </div>
          </button>
        ))}
      </div>
      <div className="card form-card">
        <h2>Contribution</h2>
        <p className="muted">Choose how much of the available contribution should be directed to your selected charity.</p>
        <label>Percentage: <strong>{percentage}%</strong>
          <input type="range" min="10" max="100" step="5" value={percentage} onChange={e => setPercentage(Number(e.target.value))} />
        </label>
        <button className="btn btn-primary" disabled={saving || !selected} onClick={save}>{saving ? "Saving..." : mine ? "Update charity" : "Save charity"}</button>
      </div>
    </>
  );
}
