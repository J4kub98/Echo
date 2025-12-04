"use client";

import { useState } from "react";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { supabase, type MoodEntry } from "@/lib/supabase";
import { MoodCard } from "@/components/feed/MoodCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    
    try {
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
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
    <div className="p-4 max-w-lg mx-auto space-y-6 min-h-screen pb-20">
      <h1 className="text-2xl font-bold text-text">Hledat</h1>
      
      <form onSubmit={handleSearch} className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Hledat příspěvky, nálady..."
          className="w-full pl-10 p-3 rounded-xl bg-surface border border-border focus:outline-none focus:border-primary transition-colors"
        />
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : searched && results.length === 0 ? (
          <div className="text-center py-10 text-text-secondary">
            <p>Nic jsme nenašli 😔</p>
          </div>
        ) : (
          results.map((item) => (
            <MoodCard
              key={item.id}
              id={item.id}
              author="Anonymní"
              scope={item.scope}
              title={item.headline}
              body={item.reflection}
              tags={item.tags || []}
              moodTone={item.mood_tone}
              likes={0} // Search results don't show live stats for simplicity yet
              comments={0}
              timestamp={new Date(item.created_at)}
            />
          ))
        )}
        
        {!searched && (
          <div className="text-center py-10 text-text-secondary">
            <p>Zadejte hledaný výraz a stiskněte Enter</p>
          </div>
        )}
      </div>
    </div>
  );
}