export default function StatusBadge({ status }) {
  const className = status === "Assigned" ? "badge badge-assigned" : "badge badge-available";
  return <span className={className}>{status}</span>;
}
