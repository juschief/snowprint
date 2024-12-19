interface DAppCardProps {
  name: string;
  description: string;
  image: string;
  url: string;
  category: string;
}

export function DAppCard({ name, description, image, url, category }: DAppCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-zinc-800/50 rounded-xl p-6 hover:bg-zinc-700/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-12 h-12 rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/dapps/placeholder.svg';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white truncate group-hover:text-blue-400 transition-colors">
              {name}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {category}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-400 line-clamp-2 group-hover:text-zinc-300 transition-colors">
            {description}
          </p>
        </div>
      </div>
    </a>
  );
} 