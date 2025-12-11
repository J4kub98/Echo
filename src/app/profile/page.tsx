"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { User, Loader2, Edit2, Save, X, Camera, Settings } from "lucide-react";
import { supabase, type MoodEntry, type Profile } from "@/lib/supabase";
import { MoodCard } from "@/components/feed/MoodCard";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [myEntries, setMyEntries] = useState<MoodEntry[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchMyEntries();
      fetchFollowStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  async function fetchFollowStats() {
    if (!user) return;
    
    const { count: followers } = await supabase
      .from("follows")
      .select("*", { count: 'exact', head: true })
      .eq("following_id", user.id);

    const { count: following } = await supabase
      .from("follows")
      .select("*", { count: 'exact', head: true })
      .eq("follower_id", user.id);

    setFollowersCount(followers || 0);
    setFollowingCount(following || 0);
  }

  if (!loading && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center space-y-8">
        <div className="w-24 h-24 bg-surfaceAlt rounded-full flex items-center justify-center mb-4 shadow-inner">
          <User className="w-10 h-10 text-text-tertiary" />
        </div>
        <div className="space-y-4 max-w-md">
          <h1 className="text-3xl font-serif font-bold text-text">Tvůj osobní prostor</h1>
          <p className="text-text-secondary leading-relaxed">
            Vytvoř si profil a začni sledovat svou cestu. Získej přehled o svých náladách, 
            ukládej si oblíbené myšlenky a propoj se s komunitou.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <button 
            onClick={() => router.push("/login")}
            className="flex-1 bg-primary text-white py-3 px-6 rounded-full font-medium shadow-button hover:bg-primaryHover transition-all active:scale-95"
          >
            Přihlásit se
          </button>
          <button 
            onClick={() => router.push("/login?tab=register")}
            className="flex-1 bg-surface text-text border border-border py-3 px-6 rounded-full font-medium hover:bg-surfaceAlt transition-all active:scale-95"
          >
            Registrovat
          </button>
        </div>
      </div>
    );
  }

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

  async function handleDeletePost(entryId: string) {
    try {
      const { error } = await supabase
        .from("mood_entries")
        .delete()
        .eq("id", entryId);

      if (error) throw error;

      setMyEntries(prev => prev.filter(e => e.id !== entryId));
      toast.success("Příspěvek byl smazán.");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Nepodařilo se smazat příspěvek.");
    }
  }

  async function fetchMyEntries() {
    try {
      const { data, error } = await supabase
        .from("mood_entries")
        .select("*, reactions(count), replies(count)")
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

  const avatarUrl = profile?.avatar_url || (profile?.username 
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`
    : null);

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-8 min-h-screen pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Můj Profil</h1>
        <Link 
          href="/settings" 
          className="p-2 text-text-secondary hover:text-text hover:bg-surfaceAlt rounded-full transition-colors"
          aria-label="Nastavení"
        >
          <Settings className="w-6 h-6" />
        </Link>
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
          <Link 
            href="/settings"
            className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-primary/90 transition-colors"
          >
            <Camera className="w-4 h-4" />
          </Link>
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
          <span className="block text-2xl font-bold text-primary">{followersCount}</span>
          <span className="text-xs text-text-secondary uppercase tracking-wider">Sledující</span>
        </div>
        <div className="bg-surface p-4 rounded-card text-center">
          <span className="block text-2xl font-bold text-primary">{followingCount}</span>
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
                  authorId={user?.id || ""}
                  avatarUrl={avatarUrl}
                  scope={item.scope}
                  title={item.headline}
                  body={item.reflection}
                  imageUrl={item.image_url}
                  tags={item.tags || []}
                  moodTone={item.mood_tone}
                  likes={(item as any).reactions?.[0]?.count || 0}
                  comments={(item as any).replies?.[0]?.count || 0}
                  timestamp={new Date(item.created_at)}
                  onDelete={() => handleDeletePost(item.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}