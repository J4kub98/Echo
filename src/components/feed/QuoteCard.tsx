import { MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";
import { motion } from "framer-motion";

interface QuoteCardProps {
  text: string;
  author: string;
  timestamp: Date;
}

export function QuoteCard({ text, author, timestamp }: QuoteCardProps) {
  const timeAgo = formatDistanceToNow(timestamp, {
    addSuffix: false,
    locale: cs,
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface rounded-card p-4 shadow-card border-l-4 border-primary"
    >
      <div className="flex items-start gap-3">
        <MessageCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed text-text mb-2">
            "{text}"
          </p>
          <p className="text-xs text-text-tertiary">
            — {author}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
