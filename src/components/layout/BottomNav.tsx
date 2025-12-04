"use client";

import { Home, Search, Grid, Bell, User, Plus } from "lucide-react";
import { useState } from "react";

interface BottomNavProps {
  onCreateClick: () => void;
}

export function BottomNav({ onCreateClick }: BottomNavProps) {
  const [active, setActive] = useState<string>("home");

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "search", icon: Search, label: "Search" },
    { id: "create", icon: Plus, label: "Create", isCenter: true },
    { id: "activity", icon: Bell, label: "Activity" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border safe-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={onCreateClick}
                className="w-14 h-14 -mt-6 bg-primary text-white rounded-full flex items-center justify-center shadow-button hover:bg-primaryHover transition-all active:scale-95 touch-manipulation"
                aria-label={item.label}
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 touch-manipulation transition-colors ${
                isActive ? "text-primary" : "text-text-tertiary"
              }`}
              aria-label={item.label}
            >
              <Icon className="w-6 h-6" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
