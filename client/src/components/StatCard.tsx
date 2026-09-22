import type { ReactNode } from "react";

export function StatCard({ label, value, icon }: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="stat-card">
      <div>
        <span className="muted">{label}</span>
        <strong>{value}</strong>
      </div>
      {icon && <div className="stat-icon">{icon}</div>}
    </div>
  );
}
