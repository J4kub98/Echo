"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Flag, Loader2 } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}

const reportReasons = [
  { id: "spam", label: "Spam nebo reklama", icon: "📢" },
  { id: "offensive", label: "Urážlivý obsah", icon: "😤" },
  { id: "misleading", label: "Zavádějící informace", icon: "❌" },
  { id: "harassment", label: "Obtěžování", icon: "🚫" },
  { id: "other", label: "Jiný důvod", icon: "📝" },
];

export function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;
    
    const reason = selectedReason === "other" 
      ? customReason 
      : reportReasons.find(r => r.id === selectedReason)?.label || "";
    
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(reason);
      onClose();
      setSelectedReason(null);
      setCustomReason("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-3xl max-h-[85vh] overflow-hidden safe-bottom"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Flag className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text">Nahlásit příspěvek</h2>
                  <p className="text-sm text-text-secondary">Vyber důvod nahlášení</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-text-tertiary hover:text-text hover:bg-surfaceAlt rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Zavřít"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-3 overflow-y-auto max-h-[50vh]">
              {reportReasons.map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                    selectedReason === reason.id
                      ? "border-primary bg-primary/5"
                      : "border-border/50 bg-surfaceAlt/30 hover:border-border"
                  }`}
                >
                  <span className="text-2xl">{reason.icon}</span>
                  <span className={`font-medium ${selectedReason === reason.id ? "text-primary" : "text-text"}`}>
                    {reason.label}
                  </span>
                  {selectedReason === reason.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-sm">✓</span>
                    </motion.div>
                  )}
                </button>
              ))}

              {/* Custom reason input */}
              {selectedReason === "other" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4"
                >
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Popiš důvod nahlášení..."
                    rows={3}
                    autoFocus
                    className="w-full p-4 rounded-2xl bg-surfaceAlt/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-text placeholder:text-text-tertiary"
                  />
                </motion.div>
              )}
            </div>

            {/* Warning */}
            <div className="mx-6 mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-700/50">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Zneužití systému hlášení může vést k omezení tvého účtu. Nahlašuj prosím pouze skutečně problematický obsah.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-4 px-6 bg-surfaceAlt text-text font-bold rounded-2xl hover:bg-border/50 transition-all active:scale-95"
              >
                Zrušit
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedReason || (selectedReason === "other" && !customReason.trim()) || isSubmitting}
                className="flex-1 py-4 px-6 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Flag className="w-5 h-5" />
                    Nahlásit
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
