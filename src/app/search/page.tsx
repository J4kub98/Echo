"use client";

import { useState } from "react";
import { Search as SearchIcon, Loader2, Hash, Sparkles } from "lucide-react";
import { supabase, type MoodEntry } from "@/lib/supabase";
import { MoodCard } from "@/components/feed/MoodCard";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleDeletePost(entryId: string) {
    try {
      const { error } = await supabase
        .from("mood_entries")
        .delete()
        .eq("id", entryId);

      if (error) throw error;

      setResults(prev => prev.filter(e => e.id !== entryId));
      toast.success("Příspěvek byl smazán.");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Nepodařilo se smazat příspěvek.");
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    
    try {
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*, profiles(username, avatar_url), reactions(count), replies(count)")
        .or(`headline.ilike.%${query}%,reflection.ilike.%${query}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-8 min-h-screen pb-24">
      <header className="space-y-4">
        <h1 className="text-2xl font-bold text-text font-serif">Objevuj</h1>
        
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-hover:bg-primary/10 transition-colors" />
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hledat myšlenky, nálady, lidi..."
              className="w-full pl-12 p-4 rounded-2xl bg-surface border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-tertiary"
            />
          </div>
        </form>
      </header>

      {!searched && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Doporučená témata</h2>
          <div className="flex flex-wrap gap-2">
            {["vděčnost", "radost", "klid", "motivace", "příroda", "rodina"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  // Trigger search manually or via effect
                }}
                className="px-4 py-2 rounded-full bg-surface border border-border text-text-secondary hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center gap-2"
              >
                <Hash className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : searched && results.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-surfaceAlt rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-6 h-6 text-text-tertiary" />
            </div>
            <h3 className="text-lg font-medium text-text mb-1">Nic jsme nenašli</h3>
            <p className="text-text-secondary">Zkus upravit hledaný výraz.</p>
          </div>
        ) : (
          results.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MoodCard
                id={item.id}
                author={(item as any).profiles?.username || "Anonymní"}
                authorId={item.author_id}
                avatarUrl={(item as any).profiles?.avatar_url || ((item as any).profiles?.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${(item as any).profiles.username}` : null)}
                scope={item.scope}
                title={item.headline}
                body={item.reflection}
                imageUrl={item.image_url}
                tags={item.tags || []}
                moodTone={item.mood_tone}
                likes={(item as any).reactions?.[0]?.count || 0}
                comments={(item as any).replies?.[0]?.count || 0}
                timestamp={new Date(item.created_at)}
                onDelete={() => handleDeletePost(item.id)}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}