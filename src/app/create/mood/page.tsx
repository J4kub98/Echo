"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

export default function CreateMoodPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [headline, setHeadline] = useState("");
  const [reflection, setReflection] = useState("");
  const [scope, setScope] = useState<"public" | "community" | "circle" | "private">("public");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [moodTone, setMoodTone] = useState("neutral");
  const [loading, setLoading] = useState(false);

  const moods = [
    { id: "happy", label: "Šťastně", emoji: "😊", color: "bg-yellow-100 border-yellow-200" },
    { id: "excited", label: "Nadšeně", emoji: "🤩", color: "bg-orange-100 border-orange-200" },
    { id: "neutral", label: "Neutrálně", emoji: "😐", color: "bg-gray-100 border-gray-200" },
    { id: "sad", label: "Smutně", emoji: "😢", color: "bg-blue-100 border-blue-200" },
    { id: "anxious", label: "Úzkostně", emoji: "😰", color: "bg-purple-100 border-purple-200" },
    { id: "angry", label: "Naštvaně", emoji: "😠", color: "bg-red-100 border-red-200" },
  ];

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      alert("Musíš být přihlášen!");
      return;
    }
    setLoading(true);

    try {
      const { error } = await supabase.from("mood_entries").insert({
        author_id: user.id,
        headline,
        reflection,
        scope,
        tags,
        mood_tone: moodTone,
        is_anonymous: true,
      });

      if (error) throw error;
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Nepodařilo se vytvořit příspěvek.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background safe-bottom">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-4 safe-top">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-text" />
        </button>
        <h1 className="text-lg font-bold text-text">Jak se cítíš?</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-lg mx-auto">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">Jaká je tvá nálada?</label>
          <div className="grid grid-cols-3 gap-2">
            {moods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMoodTone(m.id)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  moodTone === m.id
                    ? `${m.color} border-2 shadow-sm scale-105`
                    : "bg-surface border-border hover:bg-surfaceAlt"
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-xs font-medium text-text-secondary">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">Nadpis</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Krátce o tvé náladě..."
            className="w-full p-3 rounded-xl bg-surface border border-border focus:outline-none focus:border-primary transition-colors"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">Reflexe</label>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Rozepiš se o tom, co prožíváš..."
            className="w-full p-3 rounded-xl bg-surface border border-border focus:outline-none focus:border-primary transition-colors min-h-[150px]"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">Štítky</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center gap-1">
                #{tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Přidej štítek a stiskni Enter..."
            className="w-full p-3 rounded-xl bg-surface border border-border focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">Kdo to uvidí?</label>
          <div className="grid grid-cols-2 gap-2">
            {(["public", "community", "circle", "private"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScope(s)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  scope === s
                    ? "bg-primary text-white border-primary shadow-button"
                    : "bg-surface text-text-secondary border-border hover:bg-surfaceAlt"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary text-white rounded-button font-bold shadow-button hover:bg-primaryHover active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Odesílání..." : "Sdílet náladu"}
        </button>
      </form>
    </main>
  );
}
