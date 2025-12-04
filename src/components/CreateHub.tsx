"use client";

import { X, Smile, BookOpen, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface CreateHubProps {
  onClose: () => void;
}

export function CreateHub({ onClose }: CreateHubProps) {
  const router = useRouter();

  const handleSelect = (id: string) => {
    if (id === "mood") {
      onClose();
      router.push("/create/mood");
    } else {
      alert("Tato funkce bude dostupná brzy!");
    }
  };

  const options = [
    {
      id: "mood",
      icon: Smile,
      title: "Sdílet náladu",
      description: "public • community • circle • private",
    },
    {
      id: "journal",
      icon: BookOpen,
      title: "Zapsat do deníku",
      description: "Tvůj soukromý prostor pro reflexi",
    },
    {
      id: "community",
      icon: Users,
      title: "Community šepot",
      description: "Anonymní příspěvek pro komunitu",
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background z-50 flex flex-col safe-top safe-bottom"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <h2 className="text-xl font-bold text-text">Co chceš přidat?</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surfaceAlt transition-colors touch-manipulation"
            aria-label="Zavřít"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <motion.button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-surface rounded-card shadow-card flex items-start gap-4 text-left hover:bg-surfaceAlt transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-text text-lg">{option.title}</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {option.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
