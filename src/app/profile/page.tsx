"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { User, Loader2 } from "lucide-react";
import { supabase, type MoodEntry } from "@/lib/supabase";
import { MoodCard } from "@/components/feed/MoodCard";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [myEntries, setMyEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchMyEntries();
  }, [user]);

  async function fetchMyEntries() {
    try {
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("author_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyEntries(data || []);
    } catch (error) {
      console.error("Error fetching my entries:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto space-y-8 min-h-screen pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Profil</h1>
        <button
          onClick={() => signOut()}
          className="text-sm text-red-500 font-medium hover:underline"
        >
          Odhlásit se
        </button>
      </div>
      
      <div className="bg-surface rounded-card p-6 flex flex-col items-center gap-4 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-surfaceAlt flex items-center justify-center">
          <User className="w-10 h-10 text-text-secondary" />
        </div>
        <div className="text-center">
          <p className="font-bold text-lg text-text">Anonymní Uživatel</p>
          <p className="text-sm text-text-secondary">ID: {user?.id.slice(0, 8)}...</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-text">Moje příspěvky</h2>
        
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : myEntries.length === 0 ? (
          <p className="text-center text-text-secondary py-4">Zatím jsi nic nesdílel.</p>
        ) : (
          myEntries.map((item) => (
            <MoodCard
              key={item.id}
              id={item.id}
              author="Já"
              scope={item.scope}
              title={item.headline}
              body={item.reflection}
              tags={item.tags || []}
              moodTone={item.mood_tone}
              likes={0}
              comments={0}
              timestamp={new Date(item.created_at)}
            />
          ))
        )}
      </div>
    </div>
  );
}