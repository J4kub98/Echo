# Echo Web App

A warm, safe space for sharing feelings and finding support. Built with Next.js, Tailwind CSS, and Supabase.

## Features

- **Warm, Empathetic Design**: Peach and coral palette designed to be soothing.
- **Anonymous Sharing**: Share your thoughts without revealing your identity.
- **Mood Tracking**: Log your feelings and see trends over time.
- **Community Support**: React and reply to others in a safe environment.
- **PWA Ready**: Installable on mobile devices as a Progressive Web App.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (Auth, Database, Realtime)
- **Deployment**: Vercel

## Getting Started

1. **Install dependencies:**
   `ash
   npm install
   ` 

2. **Set up Environment Variables:**
   Create a \.env.local\ file in the root directory with your Supabase credentials:
   `env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ` 

3. **Run the development server:**
   `ash
   npm run dev
   ` 
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deploy to Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. **Push your code to GitHub.**
2. **Import the project** into Vercel.
3. **Configure Environment Variables** in the Vercel dashboard:
   - \NEXT_PUBLIC_SUPABASE_URL\`n   - \NEXT_PUBLIC_SUPABASE_ANON_KEY\`n4. **Deploy!**

## Project Structure

- \src/app\: Next.js App Router pages and layouts.
- \src/components\: Reusable UI components (Feed, MoodCard, CreateHub, etc.).
- \src/lib\: Utilities and Supabase client configuration.
