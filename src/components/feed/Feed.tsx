"use client";

import { useEffect, useState } from "react";
import { QuoteCard } from "./QuoteCard";
import { MoodCard } from "./MoodCard";
import { supabase, type MoodEntry } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { MoodCardSkeleton, QuoteCardSkeleton } from "@/components/ui/Skeletons";

// Hardcoded daily quote for now
const dailyQuote = {
  id: "daily-quote",
  type: "quote" as const,
  text: "Klid není absence problémů, ale schopnost je zvládat.",
  author: "Anonymní",
};

interface MoodEntryWithStats extends MoodEntry {
  profiles: { username: string; avatar_url: string } | null;
  reactions: { count: number }[];
  replies: { count: number }[];
  user_has_liked?: boolean;
}

export function Feed() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MoodEntryWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeScope, setActiveScope] = useState<"all" | "public" | "community">("all");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  useEffect(() => {
    setPage(0);
    setEntries([]);
    setHasMore(true);
    fetchEntries(0, true);
  }, [activeScope, user]);

  async function fetchEntries(pageIndex: number, isRefresh = false) {
    if (pageIndex === 0) setLoading(true);
    else setLoadingMore(true);

    try {
      const from = pageIndex * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("mood_entries")
        .select(`
          *,
          profiles (username, avatar_url),
          reactions (count),
          replies (count)
        `)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (activeScope !== "all") {
        query = query.eq("scope", activeScope);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      }

      // Check if user liked each post
      let entriesWithLikes = data as unknown as MoodEntryWithStats[];
      
      if (user && data.length > 0) {
        const { data: userReactions } = await supabase
          .from("reactions")
          .select("entry_id")
          .eq("user_id", user.id)
          .in("entry_id", data.map(e => e.id));
          
        const likedEntryIds = new Set(userReactions?.map(r => r.entry_id));
        
        entriesWithLikes = entriesWithLikes.map(entry => ({
          ...entry,
          user_has_liked: likedEntryIds.has(entry.id)
        }));
      }

      if (isRefresh) {
        setEntries(entriesWithLikes || []);
      } else {
        setEntries(prev => [...prev, ...(entriesWithLikes || [])]);
      }
    } catch (error) {
      console.error("Error fetching mood entries:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  function loadMore() {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchEntries(nextPage);
    }
  }

  async function handleDeletePost(entryId: string) {
    try {
      const { error } = await supabase
        .from("mood_entries")
        .delete()
        .eq("id", entryId);

      if (error) throw error;

      setEntries(prev => prev.filter(e => e.id !== entryId));
      toast.success("Příspěvek byl smazán.");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Nepodařilo se smazat příspěvek.");
    }
  }

  async function handleLike(entryId: string, currentLiked: boolean) {
    if (!user) {
      toast.error("Pro lajkování se musíš přihlásit.");
      return;
    }

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
    <div className="px-4 py-6 space-y-8 max-w-2xl mx-auto">
      {/* Guest Welcome Banner */}
      {!user && (
        <div className="bg-gradient-to-r from-primary/10 to-accent-orange/10 rounded-3xl p-6 border border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-text font-serif text-lg">Vítej v Echo</h2>
            </div>
            <p className="text-text-secondary text-sm mb-4 max-w-md">
              Místo pro tvé myšlenky a pocity. Připoj se k naší komunitě a začni sdílet svůj příběh.
            </p>
            <div className="flex gap-3">
              <Link 
                href="/login" 
                className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-full shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all hover:scale-105 active:scale-95"
              >
                Přihlásit se
              </Link>
              <Link 
                href="/login?mode=signup" 
                className="px-5 py-2 bg-surface text-text text-sm font-bold rounded-full border border-border/50 hover:bg-surfaceAlt transition-all"
              >
                Registrovat
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-surfaceAlt/50 backdrop-blur-sm p-1.5 rounded-full border border-border/50 shadow-inner">
          {(["all", "public", "community"] as const).map((scope) => (
            <button
              key={scope}
              onClick={() => setActiveScope(scope)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeScope === scope
                  ? "bg-surface text-primary shadow-sm ring-1 ring-black/5 scale-105"
                  : "text-text-secondary hover:text-text hover:bg-surface/50"
              }`}
            >
              {scope === "all"
                ? "Vše"
                : scope.charAt(0).toUpperCase() + scope.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Always show daily quote first */}
      <QuoteCard
        text={dailyQuote.text}
        author={dailyQuote.author}
        timestamp={new Date()}
      />

      {loading ? (
        <div className="space-y-6">
          <QuoteCardSkeleton />
          {[1, 2, 3].map((i) => (
            <MoodCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {entries.map((item) => (
            <MoodCard
              key={item.id}
              id={item.id}
              author={item.profiles?.username || "Anonymní"}
              authorId={item.author_id}
              avatarUrl={item.profiles?.avatar_url || (item.profiles?.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.profiles.username}` : null)}
              scope={item.scope}
              title={item.headline}
              body={item.reflection}
              imageUrl={item.image_url}
              tags={item.tags || []}
              moodTone={item.mood_tone}
              likes={item.reactions?.[0]?.count || 0}
              comments={item.replies?.[0]?.count || 0}
              timestamp={new Date(item.created_at)}
              isLiked={item.user_has_liked}
              onLike={() => handleLike(item.id, !!item.user_has_liked)}
              onDelete={() => handleDeletePost(item.id)}
            />
          ))}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-surfaceAlt rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📭</span>
          </div>
          <h3 className="text-lg font-medium text-text mb-1">Zatím žádné příspěvky</h3>
          <p className="text-text-secondary">Buď první, kdo něco sdílí v této kategorii!</p>
        </div>
      )}

      {hasMore && !loading && entries.length > 0 && (
        <div className="flex justify-center pt-4 pb-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2 rounded-full bg-surface border border-border text-text-secondary hover:text-primary hover:border-primary/30 transition-all disabled:opacity-50"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Načítám...
              </span>
            ) : (
              "Načíst další"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
