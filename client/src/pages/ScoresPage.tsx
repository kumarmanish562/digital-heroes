import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Loading } from "../components/Loading";
import { EmptyState } from "../components/EmptyState";
import { scoreApi } from "../services/score.api";
import { getApiError } from "../lib/api";
import { dateOnly } from "../lib/format";
import type { Score } from "../types";

export function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ score: "", scoreDate: new Date().toISOString().slice(0, 10) });
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try { setScores(await scoreApi.list()); }
    catch (err) { setError(getApiError(err)); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const payload = { score: Number(form.score), scoreDate: form.scoreDate };
      if (editing) await scoreApi.update(editing, payload);
      else await scoreApi.create(payload);
      setForm({ score: "", scoreDate: new Date().toISOString().slice(0, 10) });
      setEditing(null);
      await load();
    } catch (err) { setError(getApiError(err)); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this score?")) return;
    try { await scoreApi.remove(id); await load(); }
    catch (err) { setError(getApiError(err)); }
  }

  function edit(item: Score) {
    setEditing(item._id);
    setForm({ score: String(item.score), scoreDate: item.scoreDate.slice(0, 10) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <PageHeader title="My Scores" subtitle="Keep up to five dated scores. Scores must be between 1 and 45." />
      <div className="card form-card">
        <div className="section-title"><h2>{editing ? "Edit score" : "Add score"}</h2></div>
        <form className="inline-form" onSubmit={submit}>
          <label>Score<input type="number" min="1" max="45" required value={form.score} onChange={e => setForm({ ...form, score: e.target.value })} /></label>
          <label>Date<input type="date" required value={form.scoreDate} onChange={e => setForm({ ...form, scoreDate: e.target.value })} /></label>
          <button className="btn btn-primary"><Plus size={17} /> {editing ? "Update" : "Add"}</button>
          {editing && <button type="button" className="btn btn-ghost" onClick={() => { setEditing(null); setForm({ score: "", scoreDate: new Date().toISOString().slice(0, 10) }); }}>Cancel</button>}
        </form>
        {error && <div className="alert error">{error}</div>}
      </div>

      <div className="card">
        <div className="section-title"><h2>Saved scores</h2><span className="badge">{scores.length}/5</span></div>
        {loading ? <Loading /> : scores.length === 0 ? <EmptyState title="No scores yet" text="Add your first score above." /> : (
          <div className="table-wrap">
            <table><thead><tr><th>Score</th><th>Date</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>{scores.map(s => (
              <tr key={s._id}>
                <td><span className="number-badge">{s.score}</span></td>
                <td>{dateOnly(s.scoreDate)}</td>
                <td>{dateOnly(s.createdAt)}</td>
                <td className="actions">
                  <button className="icon-btn" onClick={() => edit(s)} title="Edit"><Pencil size={17} /></button>
                  <button className="icon-btn danger" onClick={() => remove(s._id)} title="Delete"><Trash2 size={17} /></button>
                </td>
              </tr>
            ))}</tbody></table>
          </div>
        )}
      </div>
    </>
  );
}
