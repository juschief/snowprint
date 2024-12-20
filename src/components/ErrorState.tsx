interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="w-full p-2.5 bg-zinc-800 rounded-lg">
      <div className="text-red-400 text-sm">{message}</div>
    </div>
  );
} 