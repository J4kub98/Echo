import { User, Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";

interface MoodCardProps {
  author: string;
  scope: "public" | "community" | "circle" | "private";
  title: string;
  body: string;
  tags: string[];
  likes: number;
  comments: number;
  timestamp: Date;
}

const scopeConfig = {
  public: { color: "text-accent-blue", label: "Veřejné" },
  community: { color: "text-accent-orange", label: "Komunita" },
  circle: { color: "text-accent-purple", label: "Okruh" },
  private: { color: "text-text-tertiary", label: "Soukromé" },
};

export function MoodCard({
  author,
  scope,
  title,
  body,
  tags,
  likes,
  comments,
  timestamp,
}: MoodCardProps) {
  const timeAgo = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    locale: cs,
  });

  const scopeInfo = scopeConfig[scope] || scopeConfig.public;

  return (
    <div className="bg-surface rounded-card p-4 shadow-card">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-surfaceAlt flex items-center justify-center">
          <User className="w-5 h-5 text-text-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text">{author}</p>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span className={scopeInfo.color}>• {scopeInfo.label}</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <h3 className="text-base font-semibold text-text mb-2">{title}</h3>
        <p className="text-sm leading-relaxed text-text-secondary line-clamp-4">
          {body}
        </p>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 text-text-tertiary">
        <button className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors touch-manipulation">
          <Heart className="w-4 h-4" />
          {likes > 0 && <span>{likes}</span>}
        </button>
        <button className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors touch-manipulation">
          <MessageCircle className="w-4 h-4" />
          {comments > 0 && <span>{comments}</span>}
        </button>
      </div>
    </div>
  );
}
