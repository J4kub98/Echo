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
      className="bg-surface rounded-card p-5 shadow-card hover:shadow-cardHover border border-border/40 transition-all duration-300 cursor-pointer relative group"
    >
      {/* Report Button */}
      {id && (
        <button
          onClick={handleReport}
          className="absolute top-4 right-4 p-2 text-text-tertiary hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
          title="Nahlásit příspěvek"
        >
          <Flag className="w-4 h-4" />
        </button>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-surfaceAlt flex items-center justify-center overflow-hidden ring-2 ring-surface">
          {avatarUrl ? (
            <img src={avatarUrl} alt={author} className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-text-secondary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-text">{author}</p>
            <span className="text-xs text-text-tertiary">•</span>
            <span className="text-xs text-text-tertiary">{timeAgo}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={`font-medium ${scopeInfo.color}`}>{scopeInfo.label}</span>
          </div>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${moodInfo.color} bg-opacity-10`}>
           <span className="text-lg" role="img" aria-label={moodTone}>{moodInfo.emoji}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-text mb-2 leading-tight">{title}</h3>
        <p className="text-sm leading-relaxed text-text-secondary line-clamp-3">
          {body}
        </p>
        {imageUrl && (
          <div className="mt-4 rounded-2xl overflow-hidden shadow-sm">
            <img src={imageUrl} alt="Mood attachment" className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium text-text-secondary bg-surfaceAlt px-2.5 py-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-border/40">
        <button 
          onClick={handleLikeClick}
          className={`flex items-center gap-2 text-sm font-medium transition-colors touch-manipulation group/like ${isLiked ? "text-primary" : "text-text-tertiary hover:text-primary"}`}
        >
          <motion.div
            whileTap={{ scale: 0.8 }}
            animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
            className={`p-1.5 rounded-full group-hover/like:bg-primary/10 transition-colors`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          </motion.div>
          {likes > 0 && <span>{likes}</span>}
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-text-tertiary hover:text-accent-blue transition-colors touch-manipulation group/comment">
          <div className="p-1.5 rounded-full group-hover/comment:bg-accent-blue/10 transition-colors">
            <MessageCircle className="w-5 h-5" />
          </div>
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
