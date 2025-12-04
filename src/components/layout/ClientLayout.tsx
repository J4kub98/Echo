"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";
import { CreateHub } from "./CreateHub";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showCreate, setShowCreate] = useState(false);
  const pathname = usePathname();

  // Hide navigation on login page and create pages
  const isHidden = pathname === "/login" || pathname.startsWith("/create");

  return (
    <>
      {children}
      
      {!isHidden && (
        <>
          <BottomNav onCreateClick={() => setShowCreate(true)} />
          {showCreate && <CreateHub onClose={() => setShowCreate(false)} />}
        </>
      )}
    </>
  );
}