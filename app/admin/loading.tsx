export default function AdminLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl bg-surface" />
      ))}
    </div>
  );
}
