"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { User, Loader2, Edit2, Save, X, Camera } from "lucide-react";
import { supabase, type MoodEntry, type Profile } from "@/lib/supabase";
import { MoodCard } from "@/components/feed/MoodCard";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [myEntries, setMyEntries] = useState<MoodEntry[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchMyEntries();
    }
  }, [user]);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
      }

      if (data) {
        setProfile(data);
        setUsername(data.username || "");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function updateProfile() {
    if (!user) return;
    if (!username.trim()) {
      toast.error("Uživatelské jméno nesmí být prázdné");
      return;
    }

    try {
      const updates = {
        id: user.id,
        username: username.trim(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;

      toast.success("Profil byl aktualizován");
      setProfile({ ...profile, ...updates } as Profile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Nepodařilo se aktualizovat profil");
    }
  }

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

  const avatarUrl = profile?.username 
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`
    : null;

  return (
    <div className="p-4 max-w-lg mx-auto space-y-8 min-h-screen pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Můj Profil</h1>
        <button
          onClick={() => signOut()}
          className="text-sm text-red-500 font-medium hover:underline"
        >
          Odhlásit se
        </button>
      </div>
      
      {/* Profile Card */}
      <div className="bg-surface rounded-card p-6 flex flex-col items-center gap-4 shadow-sm relative overflow-hidden">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-surfaceAlt flex items-center justify-center overflow-hidden border-4 border-surface">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-text-secondary" />
            )}
          </div>
          {/* Placeholder for future photo upload */}
          <button 
            className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-primary/90 transition-colors"
            onClick={() => toast.info("Nahrávání fotek bude dostupné brzy!")}
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="text-center w-full">
          {isEditing ? (
            <div className="flex items-center justify-center gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-surfaceAlt border border-border rounded-lg px-3 py-1 text-center font-bold text-lg text-text focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tvé jméno"
                autoFocus
              />
              <button onClick={updateProfile} className="p-1.5 bg-accent-green/10 text-accent-green rounded-full hover:bg-accent-green/20 transition-colors">
                <Save className="w-4 h-4" />
              </button>
              <button onClick={() => setIsEditing(false)} className="p-1.5 bg-red-500/10 text-red-600 rounded-full hover:bg-red-500/20 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h2 className="font-bold text-xl text-text">
                {profile?.username || "Anonymní Uživatel"}
              </h2>
              <button 
                onClick={() => {
                  setUsername(profile?.username || "");
                  setIsEditing(true);
                }}
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-sm text-text-secondary mt-1">
            {myEntries.length} {myEntries.length === 1 ? "příspěvek" : (myEntries.length >= 2 && myEntries.length <= 4) ? "příspěvky" : "příspěvků"}
          </p>
        </div>
      </div>

      {/* Stats / Bio Placeholder */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface p-4 rounded-card text-center">
          <span className="block text-2xl font-bold text-primary">0</span>
          <span className="text-xs text-text-secondary uppercase tracking-wider">Sledující</span>
        </div>
        <div className="bg-surface p-4 rounded-card text-center">
          <span className="block text-2xl font-bold text-primary">0</span>
          <span className="text-xs text-text-secondary uppercase tracking-wider">Sleduji</span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-text">Moje historie</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : myEntries.length === 0 ? (
          <div className="text-center py-8 bg-surface rounded-card border-dashed border-2 border-border">
            <p className="text-text-secondary mb-2">Zatím jsi nic nesdílel.</p>
            <p className="text-sm text-text-secondary">Tvůj deník nálad je prázdný.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myEntries.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MoodCard
                  id={item.id}
                  author={profile?.username || "Já"}
                  scope={item.scope}
                  title={item.headline}
                  body={item.reflection}
                  tags={item.tags || []}
                  moodTone={item.mood_tone}
                  likes={0} // TODO: Fetch real likes count
                  comments={0} // TODO: Fetch real comments count
                  timestamp={new Date(item.created_at)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}