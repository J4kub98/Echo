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

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    try {
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setEntries(data);
    } catch (error) {
      console.error("Error fetching mood entries:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-3 space-y-4 max-w-lg mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-surface rounded-card"></div>
          <div className="h-48 bg-surface rounded-card"></div>
          <div className="h-48 bg-surface rounded-card"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 space-y-4 max-w-lg mx-auto">
      {/* Always show daily quote first */}
      <QuoteCard
        text={dailyQuote.text}
        author={dailyQuote.author}
        timestamp={new Date()}
      />

      {entries.map((item) => (
        <MoodCard
          key={item.id}
          author="Anonymní" // Placeholder until we join profiles
          scope={item.scope}
          title={item.headline}
          body={item.reflection}
          tags={item.tags || []}
          likes={0} // Placeholder
          comments={0} // Placeholder
          timestamp={new Date(item.created_at)}
        />
      ))}

      {entries.length === 0 && (
        <div className="text-center py-10 text-text-secondary">
          <p>Zatím žádné příspěvky. Buď první!</p>
        </div>
      )}
    </div>
  );
}
