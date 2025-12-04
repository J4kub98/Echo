"use client";

import { Feed } from "@/components/feed/Feed";

export default function Home() {
  return (
    <main className="min-h-screen pb-20 safe-bottom">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm safe-top">
        <div className="px-4 py-3">
          <h1 className="text-2xl font-bold text-text">Echo</h1>
        </div>
      </header>

      {/* Feed */}
      <Feed />
    </main>
  );
}
