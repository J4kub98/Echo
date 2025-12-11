import { useState } from "react";
import { User, Heart, MessageCircle, MoreHorizontal, Trash2, Flag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { ReportModal } from "@/components/ui/ReportModal";

interface MoodCardProps {
  id?: string;
  author: string;
  authorId: string;
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
  onDelete?: () => void;
}

const scopeConfig = {
  public: { color: "text-accent-blue", label: "Veřejné" },
  community: { color: "text-accent-orange", label: "Komunita" },
  circle: { color: "text-accent-purple", label: "Okruh" },
  private: { color: "text-text-tertiary", label: "Soukromé" },
};

const moodConfig: Record<string, { emoji: string; color: string; shadow: string; gradient: string }> = {
  happy: { emoji: "😊", color: "bg-yellow-400", shadow: "shadow-yellow-400/20", gradient: "from-yellow-400/10" },
  excited: { emoji: "🤩", color: "bg-accent-orange", shadow: "shadow-accent-orange/20", gradient: "from-accent-orange/10" },
  neutral: { emoji: "😐", color: "bg-text-tertiary", shadow: "shadow-gray-400/20", gradient: "from-gray-400/10" },
  sad: { emoji: "😢", color: "bg-accent-blue", shadow: "shadow-accent-blue/20", gradient: "from-accent-blue/10" },
  anxious: { emoji: "😰", color: "bg-accent-purple", shadow: "shadow-accent-purple/20", gradient: "from-accent-purple/10" },
  angry: { emoji: "😠", color: "bg-red-400", shadow: "shadow-red-400/20", gradient: "from-red-400/10" },
};

export function MoodCard({
  id,
  author,
  authorId,
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
  onDelete,
}: MoodCardProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAuth();
  const isOwner = user?.id === authorId;

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

  const handleOpenReport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user || !id) {
      toast.error("Pro nahlášení musíš být přihlášen.");
      return;
    }
    setShowReportModal(true);
  };

  const handleSubmitReport = async (reason: string) => {
    if (!user || !id) return;

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
    <motion.article
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="relative bg-surface/80 backdrop-blur-sm rounded-card p-6 shadow-sm hover:shadow-cardHover transition-all duration-300 border border-border overflow-hidden group active:scale-[0.98]"
    >
      {/* Mood Aura Gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${moodInfo.gradient} to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100`} />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-surfaceAlt flex items-center justify-center overflow-hidden border border-border">
              {avatarUrl ? (
                <img src={avatarUrl} alt={author} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-text-secondary" />
              )}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${moodInfo.color} flex items-center justify-center text-[10px] border-2 border-surface shadow-sm`}>
              {moodInfo.emoji}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-text text-sm">{author}</h3>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span>{timeAgo}</span>
              <span>•</span>
              <span className={scopeInfo.color}>{scopeInfo.label}</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            aria-label="Více možností" 
            className="text-text-tertiary hover:text-text transition-colors p-2 rounded-full hover:bg-surfaceAlt opacity-100 md:opacity-0 md:group-hover:opacity-100 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg z-50 overflow-hidden py-1">
              {isOwner ? (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowMenu(false);
                    if (confirm("Opravdu chceš smazat tento příspěvek?")) onDelete?.();
                  }}
                  className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 flex items-center gap-2 text-sm font-bold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Smazat příspěvek
                </button>
              ) : (
                <button 
                  onClick={(e) => {
                    handleOpenReport(e);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 text-text hover:bg-surfaceAlt flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <Flag className="w-4 h-4" />
                  Nahlásit příspěvek
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 relative z-10">
        <h2 className="text-lg font-bold text-text mb-2 leading-tight group-hover:text-primary transition-colors">
          {title}
        </h2>
        <p className="text-text-secondary leading-relaxed font-serif text-[1.05rem]">
          {body}
        </p>
      </div>

      {imageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden border border-border/50">
          <img src={imageUrl} alt="Mood attachment" className="w-full h-auto object-cover max-h-96" loading="lazy" />
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span key={tag} className="text-xs font-medium text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex gap-4">
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1.5 text-sm font-medium transition-all active:scale-95 ${
              isLiked ? "text-red-500" : "text-text-secondary hover:text-red-500"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            <span>{likes}</span>
          </button>
          <div className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
            <MessageCircle className="w-5 h-5" />
            <span>{comments}</span>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleSubmitReport}
      />
    </motion.article>
  );

  if (id) {
    return (
      <>
        <Link href={`/post/${id}`} className="block">{CardContent}</Link>
      </>
    );
  }

  return CardContent;
}
