interface SortableHeaderProps {
  label: string;
  field: string;
  currentField: string;
  direction: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export function SortableHeader({ 
  label, 
  field, 
  currentField, 
  direction, 
  onSort 
}: SortableHeaderProps) {
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 text-zinc-400 hover:text-white transition-colors"
    >
      <span>{label}</span>
      {currentField === field && (
        <span className="ml-1">
          {direction === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  );
} 