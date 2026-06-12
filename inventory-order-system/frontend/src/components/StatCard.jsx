export default function StatCard({ label, value, helper, tone = 'blue' }) {
  return (
    <div className={`stat-card glass ${tone}`}>
      <p>{label}</p>
      <h3>{value}</h3>
      {helper && <span>{helper}</span>}
    </div>
  );
}
