"use client";

import { useEffect, useState } from "react";
import { QuoteCard } from "./QuoteCard";
import { MoodCard } from "./MoodCard";
import { supabase, type MoodEntry } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

// Hardcoded daily quote for now
const dailyQuote = {
  id: "daily-quote",
  type: "quote" as const,
  text: "Klid není absence problémů, ale schopnost je zvládat.",
  author: "Anonymní",
};

interface MoodEntryWithStats extends MoodEntry {
  reactions: { count: number }[];
  replies: { count: number }[];
  user_has_liked?: boolean;
}

export function Feed() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MoodEntryWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeScope, setActiveScope] = useState<"all" | "public" | "community">("all");

  useEffect(() => {
    fetchEntries();
  }, [activeScope, user]);

  async function fetchEntries() {
    setLoading(true);
    try {
      let query = supabase
        .from("mood_entries")
        .select(`
          *,
          reactions (count),
          replies (count)
        `)
        .order("created_at", { ascending: false });

      if (activeScope !== "all") {
        query = query.eq("scope", activeScope);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Check if user liked each post
      let entriesWithLikes = data as unknown as MoodEntryWithStats[];
      
      if (user && data) {
        const { data: userReactions } = await supabase
          .from("reactions")
          .select("entry_id")
          .eq("user_id", user.id);
          
        const likedEntryIds = new Set(userReactions?.map(r => r.entry_id));
        
        entriesWithLikes = entriesWithLikes.map(entry => ({
          ...entry,
          user_has_liked: likedEntryIds.has(entry.id)
        }));
      }

      setEntries(entriesWithLikes || []);
    } catch (error) {
      console.error("Error fetching mood entries:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(entryId: string, currentLiked: boolean) {
    if (!user) return;

    try {
      if (currentLiked) {
        await supabase
          .from("reactions")
          .delete()
          .eq("entry_id", entryId)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("reactions")
          .insert({
            entry_id: entryId,
            user_id: user.id,
            type: "like"
          });
      }
      
      // Optimistic update
      setEntries(prev => prev.map(entry => {
        if (entry.id === entryId) {
          const newCount = (entry.reactions[0]?.count || 0) + (currentLiked ? -1 : 1);
          return {
            ...entry,
            user_has_liked: !currentLiked,
            reactions: [{ count: newCount }]
          };
        }
        return entry;
      }));

    } catch (error) {
      console.error("Error toggling like:", error);
      fetchEntries(); // Revert on error
    }
  }

  return (
    <div className="px-4 py-3 space-y-4 max-w-lg mx-auto">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {(["all", "public", "community"] as const).map((scope) => (
          <button
            key={scope}
            onClick={() => setActiveScope(scope)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeScope === scope
                ? "bg-primary text-white shadow-button"
                : "bg-surface text-text-secondary hover:bg-surfaceAlt"
            }`}
          >
            {scope === "all"
              ? "Vše"
              : scope.charAt(0).toUpperCase() + scope.slice(1)}
          </button>
        ))}
      </div>

      {/* Always show daily quote first */}
      <QuoteCard
        text={dailyQuote.text}
        author={dailyQuote.author}
        timestamp={new Date()}
      />

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-surface rounded-card"></div>
          <div className="h-48 bg-surface rounded-card"></div>
        </div>
      ) : (
        entries.map((item) => (
          <MoodCard
            key={item.id}
            id={item.id}
            author="Anonymní"
            scope={item.scope}
            title={item.headline}
            body={item.reflection}
            tags={item.tags || []}
            moodTone={item.mood_tone}
            likes={item.reactions?.[0]?.count || 0}
            comments={item.replies?.[0]?.count || 0}
            timestamp={new Date(item.created_at)}
            isLiked={item.user_has_liked}
            onLike={() => handleLike(item.id, !!item.user_has_liked)}
          />
        ))
      )}

      {!loading && entries.length === 0 && (
        <div className="text-center py-10 text-text-secondary">
          <p>Zatím žádné příspěvky v této kategorii.</p>
        </div>
      )}
    </div>
  );
}
