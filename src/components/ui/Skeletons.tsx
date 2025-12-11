"use client";

import { motion } from "framer-motion";

// Skeleton pro MoodCard
export function MoodCardSkeleton() {
  return (
    <div className="relative bg-surface/80 backdrop-blur-sm rounded-card p-6 shadow-sm border border-border overflow-hidden animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-surfaceAlt" />
          <div className="space-y-2">
            {/* Username */}
            <div className="h-4 w-24 bg-surfaceAlt rounded-md" />
            {/* Meta */}
            <div className="h-3 w-32 bg-surfaceAlt/70 rounded-md" />
          </div>
        </div>
        {/* More button placeholder */}
        <div className="w-8 h-8 rounded-full bg-surfaceAlt/50" />
      </div>

      {/* Title */}
      <div className="mb-4 space-y-3">
        <div className="h-6 w-3/4 bg-surfaceAlt rounded-md" />
        {/* Body lines */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-surfaceAlt/70 rounded-md" />
          <div className="h-4 w-5/6 bg-surfaceAlt/70 rounded-md" />
          <div className="h-4 w-4/6 bg-surfaceAlt/70 rounded-md" />
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-surfaceAlt/50 rounded-full" />
        <div className="h-6 w-20 bg-surfaceAlt/50 rounded-full" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex gap-4">
          <div className="h-5 w-12 bg-surfaceAlt/50 rounded-md" />
          <div className="h-5 w-12 bg-surfaceAlt/50 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// Skeleton pro QuoteCard
export function QuoteCardSkeleton() {
  return (
    <div className="relative bg-surface rounded-card p-8 shadow-sm border border-border overflow-hidden animate-pulse">
      <div className="flex flex-col items-center text-center">
        {/* Quote icon */}
        <div className="w-8 h-8 bg-primary/10 rounded-full mb-4" />
        
        {/* Quote text */}
        <div className="space-y-3 w-full max-w-md mb-6">
          <div className="h-6 w-full bg-surfaceAlt/70 rounded-md mx-auto" />
          <div className="h-6 w-4/5 bg-surfaceAlt/70 rounded-md mx-auto" />
        </div>
        
        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-surfaceAlt" />
          <div className="h-4 w-20 bg-surfaceAlt rounded-md" />
          <div className="h-px w-8 bg-surfaceAlt" />
        </div>
      </div>
    </div>
  );
}

// Skeleton pro Feed (kombinace)
export function FeedSkeleton() {
  return (
    <div className="space-y-6">
      <QuoteCardSkeleton />
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <MoodCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

// Skeleton pro Profile card
export function ProfileCardSkeleton() {
  return (
    <div className="bg-surface rounded-card p-6 flex flex-col items-center gap-4 shadow-sm animate-pulse">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full bg-surfaceAlt" />
      
      {/* Username */}
      <div className="h-6 w-32 bg-surfaceAlt rounded-md" />
      
      {/* Stats */}
      <div className="h-4 w-20 bg-surfaceAlt/70 rounded-md" />
    </div>
  );
}

// Skeleton pro Activity item
export function ActivityItemSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 bg-surface rounded-2xl border border-border/50 animate-pulse">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-surfaceAlt flex-shrink-0" />
      
      <div className="flex-1 min-w-0 space-y-2">
        {/* Title */}
        <div className="h-4 w-3/4 bg-surfaceAlt rounded-md" />
        {/* Subtitle */}
        <div className="h-3 w-1/2 bg-surfaceAlt/70 rounded-md" />
      </div>
      
      {/* Time */}
      <div className="h-3 w-12 bg-surfaceAlt/50 rounded-md flex-shrink-0" />
    </div>
  );
}

// Skeleton pro Search result
export function SearchResultSkeleton() {
  return (
    <div className="p-4 bg-surface rounded-2xl border border-border/50 animate-pulse">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-surfaceAlt" />
        
        <div className="flex-1 space-y-2">
          {/* Name */}
          <div className="h-5 w-32 bg-surfaceAlt rounded-md" />
          {/* Bio */}
          <div className="h-4 w-48 bg-surfaceAlt/70 rounded-md" />
        </div>
      </div>
    </div>
  );
}
