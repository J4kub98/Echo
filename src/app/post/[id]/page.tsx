"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Send } from "lucide-react";
import { supabase, type MoodEntry } from "@/lib/supabase";
import { MoodCard } from "@/components/feed/MoodCard";
import { useAuth } from "@/lib/auth-context";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";

interface Reply {
  id: string;
  body: string;
  created_at: string;
  author_id: string;
}

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [entry, setEntry] = useState<MoodEntry | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchPostData();
  }, [id]);

  async function fetchPostData() {
    try {
      // Fetch entry
      const { data: entryData, error: entryError } = await supabase
        .from("mood_entries")
        .select("*")
        .eq("id", id)
        .single();

      if (entryError) throw entryError;
      setEntry(entryData);

      // Fetch replies
      const { data: repliesData, error: repliesError } = await supabase
        .from("replies")
        .select("*")
        .eq("entry_id", id)
        .order("created_at", { ascending: true });

      if (repliesError) throw repliesError;
      setReplies(repliesData || []);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!newReply.trim() || !user) return;

    try {
      const { error } = await supabase.from("replies").insert({
        entry_id: id,
        author_id: user.id,
        body: newReply.trim(),
      });

      if (error) throw error;
      setNewReply("");
      fetchPostData(); // Refresh replies
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Nepodařilo se odeslat odpověď.");
    }
  }

  if (loading) return <div className="p-4 text-center">Načítání...</div>;
  if (!entry) return <div className="p-4 text-center">Příspěvek nenalezen.</div>;

  return (
    <main className="min-h-screen bg-background pb-20 safe-bottom">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-4 safe-top">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-text" />
        </button>
        <h1 className="text-lg font-bold text-text">Detail příspěvku</h1>
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-6">
        <MoodCard
          author="Anonymní"
          scope={entry.scope}
          title={entry.headline}
          body={entry.reflection}
          tags={entry.tags || []}
          likes={0}
          comments={replies.length}
          timestamp={new Date(entry.created_at)}
        />

        <div className="space-y-4">
          <h3 className="font-bold text-text">Odpovědi ({replies.length})</h3>
          
          {replies.length === 0 ? (
            <p className="text-text-secondary text-sm">Zatím žádné odpovědi. Buď první!</p>
          ) : (
            replies.map((reply) => (
              <div key={reply.id} className="bg-surface rounded-card p-4 shadow-sm">
                <p className="text-sm text-text mb-2">{reply.body}</p>
                <p className="text-xs text-text-tertiary">
                  {formatDistanceToNow(new Date(reply.created_at), {
                    addSuffix: true,
                    locale: cs,
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reply Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 safe-bottom">
        <form onSubmit={handleSendReply} className="max-w-lg mx-auto flex gap-2">
          <input
            type="text"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Napiš podporující odpověď..."
            className="flex-1 p-3 rounded-full bg-surfaceAlt border border-border focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={!newReply.trim()}
            className="p-3 bg-primary text-white rounded-full shadow-button disabled:opacity-50 disabled:shadow-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </main>
  );
}
