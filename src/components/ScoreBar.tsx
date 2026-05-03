export function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-black/60 mb-1">
        <span>{label}</span>
        <span className="tabular-nums">{value}/10</span>
      </div>
      <div className="h-2 bg-black/5 rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full" style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  );
}
