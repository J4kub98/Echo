"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, Bell, Palette, LogOut, ChevronRight, Moon, Sun, Globe, Shield, Smartphone, Mail, Check, Loader2, Camera } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { supabase, type Profile } from "@/lib/supabase";

const tabs = [
  { id: "account", label: "Účet", icon: User },
  { id: "privacy", label: "Soukromí", icon: Lock },
  { id: "notifications", label: "Upozornění", icon: Bell },
  { id: "appearance", label: "Vzhled", icon: Palette },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const { signOut, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  
  // Profile state
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setIsLoading(false);
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
        setBio(data.bio || "");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // Update profile immediately with new avatar
      const updates = {
        id: user?.id,
        avatar_url: data.publicUrl,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase.from('profiles').upsert(updates);

      if (updateError) throw updateError;

      setProfile({ ...profile, ...updates } as Profile);
      toast.success('Avatar aktualizován!');
    } catch (error: any) {
      toast.error('Chyba při nahrávání avatara.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  async function saveProfile() {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const updates = {
        id: user.id,
        username: username.trim() || null,
        bio: bio.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;

      setProfile({ ...profile, ...updates } as Profile);
      toast.success("Profil byl uložen!");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      if (error.message?.includes("username_length")) {
        toast.error("Uživatelské jméno musí mít alespoň 3 znaky.");
      } else if (error.message?.includes("duplicate")) {
        toast.error("Toto uživatelské jméno je již obsazené.");
      } else {
        toast.error("Nepodařilo se uložit profil.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
      toast.success("Byl jsi odhlášen.");
    } catch (error) {
      toast.error("Chyba při odhlašování.");
    }
  };

  // Guest View
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 min-h-screen pb-24">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-text mb-3 font-serif">Nastavení</h1>
          <p className="text-text-secondary">Přizpůsob si svůj zážitek.</p>
        </header>

        <div className="space-y-6">
          <div className="bg-surface/50 backdrop-blur-xl rounded-3xl p-8 border border-border/50 text-center space-y-6 shadow-sm">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text mb-2 font-serif">Můj Profil</h2>
              <p className="text-text-secondary mb-6">Přihlas se pro správu svého účtu a synchronizaci dat.</p>
              <Link 
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all hover:scale-105 active:scale-95"
              >
                Přihlásit se
              </Link>
            </div>
          </div>

          <div className="bg-surface/50 backdrop-blur-xl rounded-3xl p-6 border border-border/50 shadow-sm">
            <h3 className="font-bold text-text mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Vzhled
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'Světlý', icon: Sun },
                { id: 'dark', label: 'Tmavý', icon: Moon },
                { id: 'system', label: 'Systém', icon: Globe },
              ].map((theme) => (
                <button
                  key={theme.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl border border-border/50 bg-surfaceAlt/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <theme.icon className="w-5 h-5 text-text-secondary" />
                  <span className="font-medium text-xs text-text-secondary">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen pb-24">
      <header className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-3 font-serif">Nastavení</h1>
        <p className="text-text-secondary text-lg">Spravuj svůj účet a preference aplikace.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-4 lg:col-span-3 space-y-2">
          <div className="bg-surface/50 backdrop-blur-xl rounded-3xl p-2 border border-border/50 shadow-sm flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-2 md:gap-0 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden group whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-text-secondary hover:bg-surfaceAlt hover:text-text"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white" : "text-text-tertiary group-hover:text-primary"}`} />
                <span className="font-medium relative z-10">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-6 py-4 rounded-3xl bg-red-50/50 border border-red-100 text-red-600 hover:bg-red-100/50 hover:border-red-200 transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <LogOut className="w-4 h-4 text-red-600" />
              </div>
              <span className="font-bold">Odhlásit se</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-8 lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-surface/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-sm border border-border/50 min-h-[500px]"
            >
              {activeTab === "account" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-text font-serif">Osobní údaje</h2>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">Profi účet</span>
                  </div>
                  
                  <div className="flex items-center gap-6 p-4 rounded-2xl bg-surfaceAlt/30 border border-border/50">
                    <div className="relative">
                      <div 
                        className="w-24 h-24 rounded-full bg-surface flex items-center justify-center text-4xl border-4 border-surface shadow-sm relative group cursor-pointer overflow-hidden"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                      >
                        {profile?.avatar_url ? (
                          <img 
                            src={profile.avatar_url} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-text-tertiary font-serif">
                            {user?.email?.[0].toUpperCase() || "U"}
                          </span>
                        )}
                        
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          {uploading ? (
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          ) : (
                            <Camera className="w-8 h-8 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-text text-lg">Profilová fotka</h3>
                      <p className="text-sm text-text-secondary mb-3">Zobrazuje se u tvých příspěvků</p>
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={uploadAvatar}
                        disabled={uploading}
                        className="hidden"
                      />
                      <button 
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        disabled={uploading}
                        className="text-sm font-bold text-primary hover:text-primary-dark transition-colors disabled:opacity-50"
                      >
                        {uploading ? 'Nahrávám...' : 'Nahrát novou'}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary ml-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                        <input
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-surfaceAlt/50 border border-border/50 text-text-secondary cursor-not-allowed font-medium"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary ml-1">Uživatelské jméno</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="@uzivatel"
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-secondary ml-1">Bio</label>
                      <textarea
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Napiš něco o sobě..."
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end border-t border-border/50">
                    <button 
                      onClick={saveProfile}
                      disabled={isSaving}
                      className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Ukládám...
                        </>
                      ) : (
                        "Uložit změny"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "privacy" && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-text font-serif mb-6">Soukromí a bezpečnost</h2>
                  
                  <div className="space-y-4">
                    {[
                      { label: "Veřejný profil", desc: "Váš profil bude viditelný pro všechny uživatele.", icon: Globe },
                      { label: "Online status", desc: "Ostatní uvidí, kdy jste aktivní.", icon: Smartphone },
                      { label: "Komentáře od cizích", desc: "Lidé mimo vaše kruhy mohou komentovat.", icon: Shield }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-surfaceAlt/30 border border-border/50 hover:bg-surfaceAlt/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-xl bg-surface text-primary shadow-sm">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-text">{item.label}</h3>
                            <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                        <div className="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors">
                          <span className="translate-x-1 inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-text font-serif mb-6">Nastavení upozornění</h2>
                  
                  <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/50 rounded-3xl bg-surfaceAlt/10">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary animate-pulse-slow">
                      <Bell className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-text mb-2">Pracujeme na tom</h3>
                    <p className="text-text-secondary max-w-xs mx-auto">
                      Brzy si budeš moci nastavit detailní preference pro notifikace.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-text font-serif mb-6">Vzhled aplikace</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: 'light' as const, label: 'Světlý', icon: Sun, desc: "Pro denní snílky" },
                      { id: 'dark' as const, label: 'Tmavý', icon: Moon, desc: "Pro noční sovy" },
                      { id: 'system' as const, label: 'Systém', icon: Globe, desc: "Automaticky" },
                    ].map((themeOption) => (
                      <button
                        key={themeOption.id}
                        onClick={() => {
                          setTheme(themeOption.id);
                          toast.success(`Vzhled změněn na: ${themeOption.label}`);
                        }}
                        className={`relative flex flex-col items-center text-center gap-4 p-6 rounded-3xl border-2 transition-all group ${
                          theme === themeOption.id 
                            ? "border-primary bg-primary/5" 
                            : "border-border/50 hover:border-primary/50 hover:bg-surfaceAlt/50"
                        }`}
                      >
                        {theme === themeOption.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                          theme === themeOption.id 
                            ? "bg-primary text-white scale-110" 
                            : "bg-surfaceAlt text-text-secondary group-hover:text-primary group-hover:scale-110"
                        }`}>
                          <themeOption.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className={`block font-bold mb-1 ${theme === themeOption.id ? "text-primary" : "text-text"}`}>
                            {themeOption.label}
                          </span>
                          <span className="text-xs text-text-tertiary">{themeOption.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
