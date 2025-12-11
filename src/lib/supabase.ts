import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase Environment Variables");
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Types matching backend schema
export interface MoodEntry {
  id: string;
  author_id: string;
  headline: string;
  reflection: string;
  scope: "public" | "community" | "circle" | "private";
  tags: string[];
  mood_tone: string;
  image_url?: string | null;
  is_anonymous: boolean;
  created_at: string;
}

export interface Reaction {
  id: string;
  entry_id: string;
  user_id: string;
  type: "like" | "hug" | "support";
  created_at: string;
}

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  updated_at: string | null;
}

export interface Report {
  id: string;
  entry_id: string;
  reporter_id: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  created_at: string;
}

export interface Reply {
  id: string;
  entry_id: string;
  author_id: string;
  body: string;
  created_at: string;
}

export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}
