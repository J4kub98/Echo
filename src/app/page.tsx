"use client";

import { useState } from "react";
import { Feed } from "@/components/feed/Feed";
import { BottomNav } from "@/components/layout/BottomNav";
import { CreateHub } from "@/components/layout/CreateHub";

export default function Home() {
  const [showCreate, setShowCreate] = useState(false);

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

      {/* Bottom Navigation */}
      <BottomNav onCreateClick={() => setShowCreate(true)} />

      {/* Create Hub Overlay */}
      {showCreate && <CreateHub onClose={() => setShowCreate(false)} />}
    </main>
  );
}
