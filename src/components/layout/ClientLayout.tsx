"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";
import { CreateHub } from "./CreateHub";
import { Sidebar } from "./Sidebar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showCreate, setShowCreate] = useState(false);
  const pathname = usePathname();

  // Hide navigation on login page and create pages
  const isHidden = pathname === "/login" || pathname.startsWith("/create");

  return (
    <div className="min-h-screen bg-background">
      {!isHidden && (
        <div className="hidden md:block fixed left-0 top-0 h-full w-64 z-30">
          <Sidebar onCreateClick={() => setShowCreate(true)} />
        </div>
      )}

      <main className={`min-h-screen ${!isHidden ? 'md:pl-64 pb-24 md:pb-0' : ''}`}>
        <div className="max-w-2xl mx-auto w-full">
          {children}
        </div>
      </main>
      
      {!isHidden && (
        <>
          <div className="md:hidden">
            <BottomNav onCreateClick={() => setShowCreate(true)} />
          </div>
          {showCreate && <CreateHub onClose={() => setShowCreate(false)} />}
        </>
      )}
    </div>
  );
}