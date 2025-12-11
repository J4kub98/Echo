import { Quote } from "lucide-react";
import { motion } from "framer-motion";

interface QuoteCardProps {
  text: string;
  author: string;
  timestamp: Date;
}

export function QuoteCard({ text, author }: QuoteCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="relative bg-surface rounded-card p-8 shadow-sm border border-border overflow-hidden group active:scale-[0.98]"
    >
      <div className="absolute top-0 right-0 -mt-4 -mr-4 text-primary/5 transform rotate-12 group-hover:scale-110 transition-transform duration-500">
        <Quote size={120} />
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <Quote className="w-8 h-8 text-primary mb-4 opacity-50" />
        
        <blockquote className="font-serif text-xl md:text-2xl text-text leading-relaxed italic mb-6">
          "{text}"
        </blockquote>
        
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-primary/30"></div>
          <cite className="text-sm font-medium text-text-secondary not-italic tracking-wide uppercase">
            {author}
          </cite>
          <div className="h-px w-8 bg-primary/30"></div>
        </div>
      </div>
    </motion.div>
  );
}
