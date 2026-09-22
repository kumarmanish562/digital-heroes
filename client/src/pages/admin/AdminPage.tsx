import { useEffect, useState } from "react";
import { BarChart3, Heart, Plus, Shield, Ticket, Trophy, Users } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { StatCard } from "../../components/StatCard";
import { Loading } from "../../components/Loading";
import { adminApi } from "../../services/admin.api";
import { getApiError } from "../../lib/api";
import { dateOnly, money } from "../../lib/format";
import type { AdminDashboard, Charity, User, Winner } from "../../types";

export function AdminPage() {
  const [tab, setTab] = useState<"overview"|"draw"|"charities"|"winners"|"users">("overview");
  const [stats, setStats] = useState<AdminDashboard | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [form, setForm] = useState({ drawDate: "", prizePoolAmount: "10000" });
  const [charityForm, setCharityForm] = useState({ name: "", description: "", image: "", website: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadOverview() {
    setLoading(true); setError("");
    try {
      const [s, u, c, w] = await Promise.all([
        adminApi.dashboard(), adminApi.users(), adminApi.charities(), adminApi.winners()
      ]);
      setStats(s); setUsers(u); setCharities(c); setWinners(w);
    } catch (err) { setError(getApiError(err)); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadOverview(); }, []);

  async function createDraw() {
    setMessage(""); setError("");
    try {
      await adminApi.createDraw({ drawDate: form.drawDate, prizePoolAmount: Number(form.prizePoolAmount) });
      setMessage("Draw created.");
      await loadOverview();
    } catch (err) { setError(getApiError(err)); }
  }

  async function createCharity() {
    setMessage(""); setError("");
    try {
      await adminApi.createCharity({ ...charityForm, active: true });
      setCharityForm({ name: "", description: "", image: "", website: "" });
      setMessage("Charity created.");
      await loadOverview();
    } catch (err) { setError(getApiError(err)); }
  }

  async function deleteCharity(id: string) {
    if (!confirm("Delete this charity?")) return;
    try { await adminApi.deleteCharity(id); await loadOverview(); }
    catch (err) { setError(getApiError(err)); }
  }

  async function winnerAction(id: string, action: "approve"|"pay"|"reject") {
    try {
      if (action === "approve") await adminApi.approveWinner(id);
      if (action === "pay") await adminApi.payWinner(id);
      if (action === "reject") {
        const reason = prompt("Rejection reason", "Proof rejected") || "Proof rejected";
        await adminApi.rejectWinner(id, reason);
      }
      await loadOverview();
    } catch (err) { setError(getApiError(err)); }
  }

  if (loading) return <Loading label="Loading admin console..." />;

  return (
    <>
      <PageHeader title="Admin Console" subtitle="Manage users, charities, draws and winner verification." />
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      <div className="tabs">
        {[
          ["overview", "Overview"], ["draw", "Draw"], ["charities", "Charities"], ["winners", "Winners"], ["users", "Users"]
        ].map(([key, label]) => <button key={key} className={tab === key ? "tab active" : "tab"} onClick={() => setTab(key as typeof tab)}>{label}</button>)}
      </div>

      {tab === "overview" && stats && (
        <>
          <div className="stats-grid">
            <StatCard label="Total users" value={stats.totalUsers} icon={<Users />} />
            <StatCard label="Active subscriptions" value={stats.activeSubscriptions} icon={<Ticket />} />
            <StatCard label="Total draws" value={stats.totalDraws} icon={<BarChart3 />} />
            <StatCard label="Pending winners" value={stats.pendingWinners} icon={<Trophy />} />
          </div>
          <div className="dashboard-grid">
            <div className="card">
              <h2>Admin workflow</h2>
              <p className="muted">Create a draw → simulate it → review winners → publish → approve and pay verified winners.</p>
            </div>
            <div className="card">
              <h2>Security</h2>
              <p className="muted"><Shield size={16} /> Admin APIs are protected by JWT + ADMIN role middleware.</p>
            </div>
          </div>
        </>
      )}

      {tab === "draw" && (
        <div className="card form-card">
          <h2>Create monthly draw</h2>
          <div className="inline-form">
            <label>Draw date<input type="datetime-local" value={form.drawDate} onChange={e => setForm({ ...form, drawDate: e.target.value })} /></label>
            <label>Prize pool<input type="number" min="0" value={form.prizePoolAmount} onChange={e => setForm({ ...form, prizePoolAmount: e.target.value })} /></label>
            <button className="btn btn-primary" onClick={createDraw}><Plus size={17}/> Create draw</button>
          </div>
        </div>
      )}

      {tab === "charities" && (
        <>
          <div className="card form-card">
            <h2>Add charity</h2>
            <div className="form-grid">
              <label>Name<input value={charityForm.name} onChange={e => setCharityForm({ ...charityForm, name: e.target.value })} /></label>
              <label>Website<input value={charityForm.website} onChange={e => setCharityForm({ ...charityForm, website: e.target.value })} /></label>
              <label>Image URL<input value={charityForm.image} onChange={e => setCharityForm({ ...charityForm, image: e.target.value })} /></label>
              <label>Description<textarea value={charityForm.description} onChange={e => setCharityForm({ ...charityForm, description: e.target.value })} /></label>
            </div>
            <button className="btn btn-primary" onClick={createCharity}><Heart size={17}/> Create charity</button>
          </div>
          <div className="card"><TableCharities charities={charities} onDelete={deleteCharity}/></div>
        </>
      )}

      {tab === "winners" && (
        <div className="card table-wrap">
          <table><thead><tr><th>Winner</th><th>Matches</th><th>Prize</th><th>Verification</th><th>Payment</th><th>Actions</th></tr></thead>
          <tbody>{winners.map(w => (
            <tr key={w._id}>
              <td>{typeof w.user === "object" ? `${w.user.name} (${w.user.email})` : w.user}</td>
              <td>{w.matchCount}/5</td><td>{money(w.prizeAmount)}</td>
              <td><span className={`status ${w.verificationStatus.toLowerCase()}`}>{w.verificationStatus}</span></td>
              <td><span className={`status ${w.paymentStatus.toLowerCase()}`}>{w.paymentStatus}</span></td>
              <td className="actions">
                {w.verificationStatus === "PENDING" && <button className="btn btn-small" onClick={() => winnerAction(w._id, "approve")}>Approve</button>}
                {w.verificationStatus === "PENDING" && <button className="btn btn-small btn-danger" onClick={() => winnerAction(w._id, "reject")}>Reject</button>}
                {w.verificationStatus === "APPROVED" && w.paymentStatus === "PENDING" && <button className="btn btn-small" onClick={() => winnerAction(w._id, "pay")}>Mark paid</button>}
              </td>
            </tr>
          ))}</tbody></table>
        </div>
      )}

      {tab === "users" && (
        <div className="card table-wrap">
          <table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Active</th><th>Joined</th></tr></thead>
          <tbody>{users.map(u => <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.active ? "Yes" : "No"}</td><td>{dateOnly(u.createdAt)}</td></tr>)}</tbody></table>
        </div>
      )}
    </>
  );
}

function TableCharities({ charities, onDelete }: { charities: Charity[]; onDelete: (id: string) => void }) {
  return <div className="table-wrap">
    <table><thead><tr><th>Name</th><th>Website</th><th>Active</th><th>Actions</th></tr></thead>
    <tbody>{charities.map(c => <tr key={c._id}><td>{c.name}</td><td>{c.website ? <a href={c.website} target="_blank" rel="noreferrer">Open</a> : "—"}</td><td>{c.active ? "Yes" : "No"}</td><td><button className="btn btn-small btn-danger" onClick={() => onDelete(c._id)}>Delete</button></td></tr>)}</tbody></table>
  </div>;
}
