export function Loading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="loading-wrap" role="status">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}
