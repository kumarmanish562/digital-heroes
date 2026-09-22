import { FormEvent, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/auth.api";
import { getApiError } from "../lib/api";

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault(); setMessage(""); setError("");
    try {
      await authApi.updateProfile(name);
      await refreshUser();
      setMessage("Profile updated successfully.");
    } catch (err) { setError(getApiError(err)); }
  }

  return (
    <>
      <PageHeader title="Profile" subtitle="Manage your account details." />
      <div className="card narrow-card">
        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}
        <form className="form" onSubmit={submit}>
          <label>Name<input required minLength={2} value={name} onChange={e => setName(e.target.value)} /></label>
          <label>Email<input value={user?.email || ""} disabled /></label>
          <label>Role<input value={user?.role || ""} disabled /></label>
          <button className="btn btn-primary">Save changes</button>
        </form>
      </div>
    </>
  );
}
