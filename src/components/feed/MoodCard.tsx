import { User, Heart, MessageCircle, Flag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

interface MoodCardProps {
  id?: string;
  author: string;
  avatarUrl?: string | null;
  scope: "public" | "community" | "circle" | "private";
  title: string;
  body: string;
  imageUrl?: string | null;
  tags: string[];
  moodTone?: string;
  likes: number;
  comments: number;
  timestamp: Date;
  isLiked?: boolean;
  onLike?: () => void;
}

const scopeConfig = {
  public: { color: "text-accent-blue", label: "Veřejné" },
  community: { color: "text-accent-orange", label: "Komunita" },
  circle: { color: "text-accent-purple", label: "Okruh" },
  private: { color: "text-text-tertiary", label: "Soukromé" },
};

const moodConfig: Record<string, { emoji: string; color: string }> = {
  happy: { emoji: "😊", color: "bg-yellow-500" },
  excited: { emoji: "🤩", color: "bg-orange-500" },
  neutral: { emoji: "😐", color: "bg-gray-500" },
  sad: { emoji: "😢", color: "bg-blue-500" },
  anxious: { emoji: "😰", color: "bg-purple-500" },
  angry: { emoji: "😠", color: "bg-red-500" },
};

export function MoodCard({
  id,
  author,
  avatarUrl,
  scope,
  title,
  body,
  imageUrl,
  tags,
  moodTone = "neutral",
  likes,
  comments,
  timestamp,
  isLiked,
  onLike,
}: MoodCardProps) {
  const timeAgo = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    locale: cs,
  });

  const scopeInfo = scopeConfig[scope] || scopeConfig.public;
  const moodInfo = moodConfig[moodTone] || moodConfig.neutral;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike?.();
  };

  const { user } = useAuth();

  const handleReport = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user || !id) {
      toast.error("Pro nahlášení musíš být přihlášen.");
      return;
    }

    const reason = prompt("Důvod nahlášení (např. spam, urážlivé):");
    if (!reason) return;

    try {
      const { error } = await supabase.from("reports").insert({
        entry_id: id,
        reporter_id: user.id,
        reason: reason,
      });

      if (error) throw error;
      toast.success("Příspěvek byl nahlášen ke kontrole.");
    } catch (error) {
      console.error("Error reporting:", error);
      toast.error("Nepodařilo se nahlásit příspěvek.");
    }
  };

  const CardContent = (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-surface rounded-card p-4 shadow-card hover:shadow-md transition-shadow cursor-pointer relative group"
    >
      {/* Report Button (Visible on hover or always on mobile if needed, keeping it subtle) */}
      {id && (
        <button
          onClick={handleReport}
          className="absolute top-4 right-4 p-1 text-text-tertiary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Nahlásit příspěvek"
        >
          <Flag className="w-4 h-4" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-surfaceAlt flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={author} className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-text-secondary" />
          )}
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
        <div className="flex items-start gap-2 mb-2">
          <span className="text-xl" role="img" aria-label={moodTone}>{moodInfo.emoji}</span>
          <h3 className="text-base font-semibold text-text">{title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-text-secondary line-clamp-4">
          {body}
        </p>
        {imageUrl && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img src={imageUrl} alt="Mood attachment" className="w-full h-48 object-cover" />
          </div>
        )}
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
        <button 
          onClick={handleLikeClick}
          className={`flex items-center gap-1.5 text-sm transition-colors touch-manipulation ${isLiked ? "text-primary" : "hover:text-primary"}`}
        >
          <motion.div
            whileTap={{ scale: 0.8 }}
            animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </motion.div>
          {likes > 0 && <span>{likes}</span>}
        </button>
        <button className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors touch-manipulation">
          <MessageCircle className="w-4 h-4" />
          {comments > 0 && <span>{comments}</span>}
        </button>
      </div>
    </motion.div>
  );

  if (id) {
    return <Link href={`/post/${id}`}>{CardContent}</Link>;
  }

  return CardContent;
}
