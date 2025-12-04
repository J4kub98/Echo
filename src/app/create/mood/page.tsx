"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CreateMoodPage() {
  const router = useRouter();
  const [headline, setHeadline] = useState("");
  const [reflection, setReflection] = useState("");
  const [scope, setScope] = useState<"public" | "community" | "circle" | "private">("public");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Get real user ID once auth is implemented
      // For now, we might fail RLS if not authenticated, but let's try
      const { error } = await supabase.from("mood_entries").insert({
        headline,
        reflection,
        scope,
        tags: [], // TODO: Add tags input
        mood_tone: "neutral", // Default for now
        is_anonymous: true,
      });

      if (error) throw error;
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Nepodařilo se vytvořit příspěvek. Jsi přihlášen?");
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
