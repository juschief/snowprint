export function LoadingState() {
  return (
    <div className="w-full p-2.5 bg-zinc-800 rounded-lg animate-pulse">
      <div className="h-4 bg-zinc-700 rounded w-1/4 mb-2"></div>
      <div className="space-y-1">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-10 bg-zinc-700 rounded"></div>
        ))}
      </div>
    </div>
  );
} 