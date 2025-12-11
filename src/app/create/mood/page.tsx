"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Image as ImageIcon, Loader2, Hash, Globe, Lock, Users, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

export default function CreateMoodPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [headline, setHeadline] = useState("");
  const [reflection, setReflection] = useState("");
  const [scope, setScope] = useState<"public" | "community" | "circle" | "private">("public");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [moodTone, setMoodTone] = useState("neutral");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const moods = [
    { id: "happy", label: "Šťastně", emoji: "😊", color: "bg-yellow-400", shadow: "shadow-yellow-400/20" },
    { id: "excited", label: "Nadšeně", emoji: "🤩", color: "bg-accent-orange", shadow: "shadow-accent-orange/20" },
    { id: "neutral", label: "Neutrálně", emoji: "😐", color: "bg-text-tertiary", shadow: "shadow-gray-400/20" },
    { id: "sad", label: "Smutně", emoji: "😢", color: "bg-accent-blue", shadow: "shadow-accent-blue/20" },
    { id: "anxious", label: "Úzkostně", emoji: "😰", color: "bg-accent-purple", shadow: "shadow-accent-purple/20" },
    { id: "angry", label: "Naštvaně", emoji: "😠", color: "bg-red-400", shadow: "shadow-red-400/20" },
  ];

  const scopes = [
    { id: "public", label: "Veřejně", icon: Globe },
    { id: "community", label: "Komunita", icon: Users },
    { id: "circle", label: "Můj kruh", icon: UserCheck },
    { id: "private", label: "Soukromě", icon: Lock },
  ] as const;

  function handleAddTag(e: React.KeyboardEvent) {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  }

  function removeTag(tagToRemove: string) {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Obrázek je příliš velký (max 5MB)");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Musíš být přihlášen!");
      return;
    }
    setLoading(true);

    try {
      let imageUrl = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('mood-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('mood-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }

      const { error } = await supabase.from("mood_entries").insert({
        author_id: user.id,
        headline,
        reflection,
        scope,
        tags,
        mood_tone: moodTone,
        image_url: imageUrl,
        is_anonymous: true,
      });

      if (error) throw error;
      toast.success("Příspěvek byl úspěšně vytvořen!");
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Nepodařilo se vytvořit příspěvek.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-4 flex items-center justify-between max-w-2xl mx-auto w-full">
        <button 
          onClick={() => router.back()} 
          className="p-2 -ml-2 hover:bg-surfaceAlt rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-text" />
        </button>
        <h1 className="text-lg font-bold text-text font-serif">Nový záznam</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-8 max-w-2xl mx-auto mt-4">
        {/* Mood Selection */}
        <section className="space-y-3">
          <label className="text-sm font-medium text-text-secondary uppercase tracking-wider ml-1">Jak se cítíš?</label>
          <div className="flex gap-3 overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-6">
            {moods.map((m) => (
              <motion.button
                key={m.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setMoodTone(m.id)}
                className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 border ${
                  moodTone === m.id
                    ? `bg-surface border-transparent ${m.shadow} shadow-lg ring-2 ring-primary/20 scale-105`
                    : "bg-surface/50 border-border hover:bg-surface hover:border-primary/30"
                }`}
              >
                <span className="text-3xl filter drop-shadow-sm">{m.emoji}</span>
                <span className={`text-xs font-medium ${moodTone === m.id ? "text-text" : "text-text-secondary"}`}>
                  {m.label}
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Content Input */}
        <section className="space-y-6 bg-surface rounded-3xl p-6 shadow-sm border border-border/50">
          <div className="space-y-2">
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Nadpis tvé myšlenky..."
              className="w-full bg-transparent text-2xl font-bold text-text placeholder:text-text-tertiary focus:outline-none"
              required
            />
          </div>

          <div className="space-y-2">
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Rozepiš se o tom, co prožíváš..."
              className="w-full bg-transparent text-lg text-text-secondary placeholder:text-text-tertiary focus:outline-none min-h-[200px] font-serif leading-relaxed resize-none"
              required
            />
          </div>

          {/* Image Preview */}
          <AnimatePresence>
            {imagePreview && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative rounded-xl overflow-hidden"
              >
                <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-96 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toolbar */}
          <div className="flex items-center gap-2 pt-4 border-t border-border/30">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
              title="Přidat fotku"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            
            <div className="h-6 w-px bg-border/50 mx-2" />

            <div className="flex-1 flex items-center gap-2">
              <Hash className="w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Přidej štítky..."
                className="flex-1 bg-transparent text-sm text-text focus:outline-none"
              />
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="bg-surfaceAlt text-text-secondary px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-border">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Scope Selection */}
        <section className="space-y-3">
          <label className="text-sm font-medium text-text-secondary uppercase tracking-wider ml-1">Viditelnost</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {scopes.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setScope(s.id as any)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200 ${
                  scope === s.id
                    ? "bg-primary text-white border-primary shadow-button"
                    : "bg-surface text-text-secondary border-border hover:bg-surfaceAlt"
                }`}
              >
                <s.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{s.label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-full font-bold text-lg shadow-button hover:bg-primaryHover active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Odesílání...</span>
              </>
            ) : (
              "Zveřejnit záznam"
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
