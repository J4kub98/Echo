"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Loader2, Heart, Bell, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";
import { motion } from "framer-motion";

export default function ActivityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchActivity();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function fetchActivity() {
    try {
      const { data: reactions, error } = await supabase
        .from("reactions")
        .select("*, mood_entries!inner(headline, author_id), profiles(username, avatar_url)")
        .eq("mood_entries.author_id", user?.id)
        .neq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setActivities(reactions || []);
    } catch (error) {
      console.error("Error fetching activity:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!loading && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center space-y-8">
        <div className="w-24 h-24 bg-surfaceAlt rounded-full flex items-center justify-center mb-4 shadow-inner">
          <Bell className="w-10 h-10 text-text-tertiary" />
        </div>
        <div className="space-y-4 max-w-md">
          <h1 className="text-3xl font-serif font-bold text-text">Tvá aktivita</h1>
          <p className="text-text-secondary leading-relaxed">
            Přihlas se a sleduj, kdo reaguje na tvé příspěvky a co se děje ve tvé komunitě.
          </p>
        </div>
        <button 
          onClick={() => router.push("/login")}
          className="bg-primary text-white py-3 px-8 rounded-full font-medium shadow-button hover:bg-primaryHover transition-all active:scale-95"
        >
          Přihlásit se
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6 min-h-screen pb-24">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text font-serif">Aktivita</h1>
        <button className="text-sm text-primary font-medium hover:underline">
          Označit vše jako přečtené
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-3xl border border-border/50">
          <div className="w-16 h-16 bg-surfaceAlt rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-6 h-6 text-text-tertiary" />
          </div>
          <p className="text-text font-medium">Zatím žádná nová upozornění</p>
          <p className="text-sm text-text-secondary mt-1">Až někdo zareaguje na tvůj příspěvek, uvidíš to zde.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((act, index) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-surface hover:bg-surfaceAlt/50 p-4 rounded-2xl border border-border/50 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-surfaceAlt flex items-center justify-center overflow-hidden border border-border">
                  {act.profiles?.avatar_url ? (
                    <img src={act.profiles.avatar_url} alt={act.profiles.username} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-text-secondary" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-red-500 text-white p-0.5 rounded-full border-2 border-surface">
                  <Heart className="w-3 h-3 fill-current" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text leading-relaxed">
                  <span className="font-bold text-text hover:underline">{act.profiles?.username || "Někdo"}</span>
                  {" "}se líbí tvůj příspěvek{" "}
                  <span className="font-medium text-text-secondary italic">"{act.mood_entries?.headline}"</span>
                </p>
                <p className="text-xs text-text-tertiary mt-1.5 font-medium">
                  {formatDistanceToNow(new Date(act.created_at), { addSuffix: true, locale: cs })}
                </p>
              </div>

              <div className="w-2 h-2 rounded-full bg-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      )}
    </div>

  );
}