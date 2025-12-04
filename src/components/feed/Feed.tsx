"use client";

import { useEffect, useState } from "react";
import { QuoteCard } from "./QuoteCard";
import { MoodCard } from "./MoodCard";
import { supabase, type MoodEntry } from "@/lib/supabase";

// Hardcoded daily quote for now
const dailyQuote = {
  id: "daily-quote",
  type: "quote" as const,
  text: "Klid není absence problémů, ale schopnost je zvládat.",
  author: "Anonymní",
};

export function Feed() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeScope, setActiveScope] = useState<"all" | "public" | "community">("all");

  useEffect(() => {
    fetchEntries();
  }, [activeScope]);

  async function fetchEntries() {
    setLoading(true);
    try {
      let query = supabase
        .from("mood_entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (activeScope !== "all") {
        query = query.eq("scope", activeScope);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (data) setEntries(data);
    } catch (error) {
      console.error("Error fetching mood entries:", error);
    } finally {
      setLoading(false);
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
            author="Anonymní"
            scope={item.scope}
            title={item.headline}
            body={item.reflection}
            tags={item.tags || []}
            likes={0}
            comments={0}
            timestamp={new Date(item.created_at)}
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
