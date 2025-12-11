"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Send, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase, type MoodEntry } from "@/lib/supabase";
import { MoodCard } from "@/components/feed/MoodCard";
import { useAuth } from "@/lib/auth-context";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Reply {
  id: string;
  body: string;
  created_at: string;
  author_id: string;
  profiles: { username: string; avatar_url: string } | null;
}

interface MoodEntryWithProfile extends MoodEntry {
  profiles: { username: string; avatar_url: string } | null;
}

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [entry, setEntry] = useState<MoodEntryWithProfile | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) fetchPostData();
  }, [id, user]);

  async function fetchPostData() {
    try {
      // Fetch entry with reaction count and profile
      const { data: entryData, error: entryError } = await supabase
        .from("mood_entries")
        .select("*, profiles(username, avatar_url), reactions(count)")
        .eq("id", id)
        .single();

      if (entryError) throw entryError;
      setEntry(entryData as MoodEntryWithProfile);
      
      // Safe cast or check for the count
      const reactions = (entryData as any).reactions as { count: number }[];
      setLikesCount(reactions?.[0]?.count || 0);

      // Check if user liked
      if (user) {
        const { data: userReaction } = await supabase
          .from("reactions")
          .select("*")
          .eq("entry_id", id)
          .eq("user_id", user.id)
          .single();
        
        setIsLiked(!!userReaction);
      }

      // Fetch replies with profiles
      const { data: repliesData, error: repliesError } = await supabase
        .from("replies")
        .select("*, profiles(username, avatar_url)")
        .eq("entry_id", id)
        .order("created_at", { ascending: true });

      if (repliesError) throw repliesError;
      setReplies(repliesData as Reply[] || []);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!entry) return;
    try {
      const { error } = await supabase
        .from("mood_entries")
        .delete()
        .eq("id", entry.id);

      if (error) throw error;

      toast.success("Příspěvek byl smazán.");
      router.push("/");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Nepodařilo se smazat příspěvek.");
    }
  }

  async function handleLike() {
    if (!user || !entry) return;

    try {
      if (isLiked) {
        await supabase
          .from("reactions")
          .delete()
          .eq("entry_id", entry.id)
          .eq("user_id", user.id);
        setLikesCount(prev => prev - 1);
      } else {
        await supabase
          .from("reactions")
          .insert({
            entry_id: entry.id,
            user_id: user.id,
            type: "like"
          });
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
      fetchPostData(); // Revert
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
      toast.success("Odpověď odeslána");
      fetchPostData(); // Refresh replies
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Nepodařilo se odeslat odpověď.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <h2 className="text-xl font-serif font-bold text-text mb-2">Příspěvek nenalezen</h2>
        <p className="text-text-secondary mb-6">Tento příspěvek možná již neexistuje.</p>
        <button onClick={() => router.back()} className="text-primary hover:underline">
          Zpět na přehled
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24 safe-bottom">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center gap-4 safe-top">
        <button 
          onClick={() => router.back()} 
          className="p-2 -ml-2 rounded-full hover:bg-surface transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-text" />
        </button>
        <h1 className="text-lg font-bold text-text font-serif">Detail myšlenky</h1>
      </header>

      <div className="p-4 max-w-2xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MoodCard
            author={entry.profiles?.username || "Anonymní"}
            authorId={entry.author_id}
            avatarUrl={entry.profiles?.avatar_url || (entry.profiles?.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.profiles.username}` : null)}
            scope={entry.scope}
            title={entry.headline}
            body={entry.reflection}
            imageUrl={entry.image_url}
            tags={entry.tags || []}
            moodTone={entry.mood_tone}
            likes={likesCount}
            comments={replies.length}
            timestamp={new Date(entry.created_at)}
            isLiked={isLiked}
            onLike={handleLike}
            onDelete={handleDelete}
          />
        </motion.div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-text font-serif text-lg">Odpovědi ({replies.length})</h3>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {replies.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-surface/30 rounded-3xl border border-dashed border-border"
                >
                  <MessageCircle className="w-8 h-8 text-text-tertiary mx-auto mb-3 opacity-50" />
                  <p className="text-text-secondary font-medium">Zatím žádné odpovědi</p>
                  <p className="text-text-tertiary text-sm mt-1">Buď první, kdo podpoří autora!</p>
                </motion.div>
              ) : (
                replies.map((reply, index) => (
                  <motion.div
                    key={reply.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-surface/50 backdrop-blur-sm rounded-2xl p-5 border border-border/50 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                       <div className="w-8 h-8 rounded-full bg-surfaceAlt overflow-hidden flex-shrink-0 ring-2 ring-surface">
                          <img 
                            src={reply.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.profiles?.username || 'anon'}`} 
                            alt="Avatar"
                            className="w-full h-full object-cover" 
                          />
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between mb-1">
                           <span className="text-sm font-bold text-text">{reply.profiles?.username || "Anonymní"}</span>
                           <span className="text-xs text-text-tertiary">
                             {formatDistanceToNow(new Date(reply.created_at), {
                               addSuffix: true,
                               locale: cs,
                             })}
                           </span>
                         </div>
                         <p className="text-sm text-text leading-relaxed">{reply.body}</p>
                       </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Reply Input or Guest CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-border/50 p-4 safe-bottom z-20">
        <div className="max-w-2xl mx-auto">
          {user ? (
            <form onSubmit={handleSendReply} className="flex gap-3 items-end">
              <div className="relative flex-1">
                <textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="Napiš podporující odpověď..."
                  rows={1}
                  className="w-full p-3 pl-4 pr-10 rounded-2xl bg-surfaceAlt/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none min-h-[48px] max-h-32"
                  style={{ height: 'auto', minHeight: '48px' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={!newReply.trim()}
                className="p-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 h-[48px] w-[48px] flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-4 p-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text">Přihlas se pro odpověď</p>
                  <p className="text-xs text-text-secondary">Podpoř autora svou reakcí</p>
                </div>
              </div>
              <Link 
                href="/login" 
                className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors"
              >
                Přihlásit
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );

}
